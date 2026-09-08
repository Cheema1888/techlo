import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { createR2PresignedUpload, deleteR2Object } from "@/lib/r2";
import crypto from "crypto";

const MAX_IMAGE_SIZE_BYTES = 256000; // 250 KB exact
const MAX_IMAGES_PER_LISTING = 4;

export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required to request an upload URL" },
        { status: 401 }
      );
    }
    await ensureDbSchema();

    const body = await req.json();
    const { draftId, contentType, size, position } = body;
    const userId = session.userId;

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

    // Replace a previous attempt for this slot so retries cannot create
    // duplicate active records.
    const existingAtPosition = await prisma.productImage.findFirst({
      where: { draftId, userId, position, status: { in: ["pending", "uploaded"] } },
      orderBy: { createdAt: "desc" },
    });
    if (existingAtPosition) {
      const deleted = await deleteR2Object(existingAtPosition.objectKey);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Unable to replace the previous image upload" },
          { status: 502 }
        );
      }
      await prisma.productImage.delete({ where: { id: existingAtPosition.id } });
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
      return NextResponse.json(
        { success: false, error: `Maximum of ${MAX_IMAGES_PER_LISTING} photos allowed per advertisement` },
        { status: 400 }
      );
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
      { success: false, error: "Failed to generate upload authorization" },
      { status: 500 }
    );
  }
}
