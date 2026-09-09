import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { deleteR2Object } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (process.env.NODE_ENV === "production") {
      if (!cronSecret) {
        return NextResponse.json(
          { success: false, error: "CRON_SECRET is not configured" },
          { status: 503 }
        );
      }
      if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

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

    const configuredRetentionDays = Number.parseInt(
      process.env.SOLD_LISTING_RETENTION_DAYS || "30",
      10
    );
    const soldRetentionDays = Number.isFinite(configuredRetentionDays)
      ? Math.min(Math.max(configuredRetentionDays, 1), 3650)
      : 30;
    const soldCutoff = new Date(
      Date.now() - soldRetentionDays * 24 * 60 * 60 * 1000
    );
    const expiredSoldProducts = await prisma.product.findMany({
      where: {
        status: "sold",
        soldAt: { lt: soldCutoff },
      },
      select: {
        id: true,
        images: {
          select: { objectKey: true },
        },
      },
      take: 50,
    });

    let deletedSoldProductsCount = 0;
    let failedSoldProductsCount = 0;
    for (const product of expiredSoldProducts) {
      let storageDeleted = true;
      for (const image of product.images) {
        if (!(await deleteR2Object(image.objectKey))) {
          storageDeleted = false;
        }
      }

      if (!storageDeleted) {
        failedSoldProductsCount++;
        continue;
      }

      await prisma.product.delete({ where: { id: product.id } });
      deletedSoldProductsCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} orphaned uploads, ${deletedChats.count} expired chat messages, and ${deletedSoldProductsCount} expired sold listings`,
      deletedUploadsCount: deletedCount,
      deletedChatMessagesCount: deletedChats.count,
      deletedSoldProductsCount,
      failedSoldProductsCount,
      soldListingRetentionDays: soldRetentionDays,
    });
  } catch (error: any) {
    console.error("GET /api/cron/cleanup-uploads error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
