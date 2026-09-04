import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { verifyR2Object } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const session = getServerSession(req);

    const body = await req.json();
    const { objectKey, userId: fallbackUserId } = body;

    const userId = session?.userId || fallbackUserId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to confirm upload" },
        { status: 401 }
      );
    }

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

    if (!imageRecord || (imageRecord.userId !== userId && !objectKey.includes(userId))) {
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
