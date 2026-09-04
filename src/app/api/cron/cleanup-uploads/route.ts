import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { deleteR2Object } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await ensureDbSchema();

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Find unattached pending or uploaded images older than 24 hours
    const orphanedImages = await prisma.productImage.findMany({
      where: {
        status: { in: ["pending", "uploaded"] },
        productId: null,
        createdAt: { lt: cutoff },
      },
      take: 50,
    });

    let deletedCount = 0;
    for (const img of orphanedImages) {
      if (img.status === "uploaded") {
        await deleteR2Object(img.objectKey);
      }
      await prisma.productImage.delete({
        where: { id: img.id },
      });
      deletedCount++;
    }

    // Purge chat messages older than 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const deletedChats = await prisma.chatMessage.deleteMany({
      where: {
        createdAt: { lt: fourteenDaysAgo },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} orphaned upload records and ${deletedChats.count} expired chat messages`,
      deletedUploadsCount: deletedCount,
      deletedChatMessagesCount: deletedChats.count,
    });
  } catch (error: any) {
    console.error("GET /api/cron/cleanup-uploads error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
