import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { deleteR2Object, uploadR2Buffer } from "@/lib/r2";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_BYTES = 256000; // 250 KB exact
const MAX_IMAGES_PER_LISTING = 4;

export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required to upload" },
        { status: 401 }
      );
    }
    await ensureDbSchema();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const draftId = (formData.get("draftId") as string) || "";
    const positionStr = (formData.get("position") as string) || "0";
    const position = parseInt(positionStr, 10);
    const userId = session.userId;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: "A valid draftId is required" },
        { status: 400 }
      );
    }

    if (isNaN(position) || position < 0 || position > 3) {
      return NextResponse.json(
        { success: false, error: "Image slot position must be between 0 and 3" },
        { status: 400 }
      );
    }

    if (file.type !== "image/webp") {
      return NextResponse.json(
        { success: false, error: "Only processed WebP images ('image/webp') are accepted" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Processed image exceeds maximum size of 250 KB (${file.size} bytes; max ${MAX_IMAGE_SIZE_BYTES} bytes)`,
        },
        { status: 400 }
      );
    }

    // Validate the actual bytes before replacing any previous draft image.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hasWebPSignature =
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
    if (!hasWebPSignature) {
      return NextResponse.json(
        { success: false, error: "Uploaded file content is not a valid WebP image" },
        { status: 400 }
      );
    }

    // Replace a pending direct-upload attempt for this slot when the browser
    // falls back to the server gateway.
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

    // Verify draft count
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

    // Upload the validated bytes to Cloudflare R2.
    const imageUuid = crypto.randomUUID();
    const objectKey = `products/${userId}/${draftId}/${imageUuid}.webp`;

    const publicUrl = await uploadR2Buffer({
      objectKey,
      contentType: "image/webp",
      buffer,
    });

    // Record in database
    await prisma.productImage.create({
      data: {
        userId,
        draftId,
        objectKey,
        url: publicUrl,
        position,
        sizeBytes: file.size,
        mimeType: "image/webp",
        status: "uploaded",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Uploaded to Cloudflare R2 via secure gateway",
      data: {
        publicUrl,
        objectKey,
        position,
        sizeBytes: file.size,
      },
    });
  } catch (error: any) {
    console.error("POST /api/uploads/server error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
