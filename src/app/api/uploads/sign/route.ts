import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { createR2PresignedUpload } from "@/lib/r2";
import crypto from "crypto";

const MAX_IMAGE_SIZE_BYTES = 256000; // 250 KB exact
const MAX_IMAGES_PER_LISTING = 4;

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const session = getServerSession(req);

    const body = await req.json();
    const { draftId, contentType, size, position, userId: fallbackUserId } = body;

    const userId = session?.userId || fallbackUserId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to request an upload URL" },
        { status: 401 }
      );
    }

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: "A valid draftId is required" },
        { status: 400 }
      );
    }

    if (typeof position !== "number" || position < 0 || position > 3) {
      return NextResponse.json(
        { success: false, error: "Image slot position must be between 0 and 3" },
        { status: 400 }
      );
    }

    if (contentType !== "image/webp") {
      return NextResponse.json(
        { success: false, error: "Only processed WebP images ('image/webp') are accepted" },
        { status: 400 }
      );
    }

    if (typeof size !== "number" || size <= 0 || size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Processed image exceeds maximum size of 250 KB (${size} bytes declared; max ${MAX_IMAGE_SIZE_BYTES} bytes)`,
        },
        { status: 400 }
      );
    }

    // Check count of active images for this draft
    const existingCount = await prisma.productImage.count({
      where: {
        draftId,
        userId,
        status: { in: ["pending", "uploaded", "attached"] },
      },
    });

    if (existingCount >= MAX_IMAGES_PER_LISTING) {
      // Check if updating an existing position or if truly exceeded
      const existingAtPosition = await prisma.productImage.findFirst({
        where: { draftId, userId, position },
      });
      if (!existingAtPosition) {
        return NextResponse.json(
          { success: false, error: `Maximum of ${MAX_IMAGES_PER_LISTING} photos allowed per advertisement` },
          { status: 400 }
        );
      }
    }

    // Generate unique object key: products/{userId}/{draftId}/{uuid}.webp
    const imageUuid = crypto.randomUUID();
    const objectKey = `products/${userId}/${draftId}/${imageUuid}.webp`;

    // Create 5-minute pre-signed PUT URL
    const presigned = await createR2PresignedUpload({
      objectKey,
      contentType: "image/webp",
      sizeBytes: size,
      expiresInSeconds: 300,
    });

    // Upsert or create ProductImage tracking row in PostgreSQL
    await prisma.productImage.create({
      data: {
        userId,
        draftId,
        objectKey,
        url: presigned.publicUrl,
        position,
        sizeBytes: size,
        mimeType: "image/webp",
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: presigned.uploadUrl,
        objectKey,
        publicUrl: presigned.publicUrl,
        expiresIn: presigned.expiresIn,
      },
    });
  } catch (error: any) {
    console.error("POST /api/uploads/sign error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate upload authorization" },
      { status: 500 }
    );
  }
}
