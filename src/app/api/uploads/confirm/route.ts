import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { deleteR2Object, verifyR2Object } from "@/lib/r2";

const MAX_IMAGE_SIZE_BYTES = 256000;

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required to confirm upload" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { objectKey } = body;
    const userId = session.userId;

    if (!objectKey) {
      return NextResponse.json(
        { success: false, error: "objectKey is required" },
        { status: 400 }
      );
    }

    // Verify record exists in DB and belongs to this user
    const imageRecord = await prisma.productImage.findUnique({
      where: { objectKey },
    });

    if (!imageRecord || imageRecord.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Image upload record not found or ownership mismatch" },
        { status: 404 }
      );
    }

    // Verify object actually exists in Cloudflare R2
    const r2Check = await verifyR2Object(objectKey);
    if (!r2Check.exists) {
      return NextResponse.json(
        { success: false, error: "Object was not found in Cloudflare R2 storage. Upload may have failed." },
        { status: 400 }
      );
    }

    if (
      r2Check.contentType !== "image/webp" ||
      !r2Check.isWebP ||
      !r2Check.sizeBytes ||
      r2Check.sizeBytes > MAX_IMAGE_SIZE_BYTES
    ) {
      const deleted = await deleteR2Object(objectKey);
      await prisma.productImage.update({
        where: { objectKey },
        data: { status: deleted ? "deleted" : "uploaded" },
      });
      return NextResponse.json(
        { success: false, error: "Uploaded object failed WebP type or 250 KB size validation" },
        { status: 400 }
      );
    }

    // Update status to 'uploaded'
    const updated = await prisma.productImage.update({
      where: { objectKey },
      data: {
        status: "uploaded",
        sizeBytes: r2Check.sizeBytes || imageRecord.sizeBytes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image verified in R2 and confirmed",
      data: {
        url: updated.url,
        objectKey: updated.objectKey,
        position: updated.position,
        sizeBytes: updated.sizeBytes,
      },
    });
  } catch (error: any) {
    console.error("POST /api/uploads/confirm error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to confirm upload" },
      { status: 500 }
    );
  }
}
