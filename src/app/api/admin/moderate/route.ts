import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { isSuperAdminEmail } from "@/lib/admin";
import { deleteR2Object } from "@/lib/r2";

const PRODUCT_STATUSES = new Set(["available", "reserved", "sold"]);
const QUOTE_STATUSES = new Set(["submitted", "under_review", "quoted", "in_progress", "completed", "cancelled"]);

export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session || !isSuperAdminEmail(session.email)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator privileges required." },
        { status: 403 }
      );
    }
    await ensureDbSchema();

    const { action, targetId, value } = await req.json();
    const adminName = session.email || "Platform Admin";

    if (!action || !targetId) {
      return NextResponse.json({ success: false, error: "action and targetId are required" }, { status: 400 });
    }

    if (action === "TOGGLE_USER_VERIFIED") {
      const user = await prisma.user.update({
        where: { id: targetId },
        data: { isVerifiedStudent: Boolean(value) },
        select: { id: true, fullName: true, email: true, university: true, isVerifiedStudent: true },
      });

      await prisma.activityLog.create({
        data: {
          actionType: "STATUS_UPDATED",
          title: `Student Verification ${value ? "Granted" : "Revoked"}`,
          description: `Admin updated verification status for ${user.fullName} (${user.university})`,
          actorName: adminName,
          actorRole: "ADMIN",
        },
      });

      return NextResponse.json({ success: true, data: user });
    }

    if (action === "UPDATE_PRODUCT_STATUS") {
      if (!PRODUCT_STATUSES.has(value)) {
        return NextResponse.json({ success: false, error: "Invalid listing status" }, { status: 400 });
      }
      const product = await prisma.product.update({
        where: { id: targetId },
        data: { status: value, soldAt: value === "sold" ? new Date() : null },
      });

      await prisma.activityLog.create({
        data: {
          actionType: "STATUS_UPDATED",
          title: `Listing Status Changed to ${value}`,
          description: `Admin updated listing status for "${product.title}"`,
          actorName: adminName,
          actorRole: "ADMIN",
        },
      });

      return NextResponse.json({ success: true, data: product });
    }

    if (action === "DELETE_PRODUCT") {
      const images = await prisma.productImage.findMany({
        where: { productId: targetId },
        select: { objectKey: true },
      });
      const deletionResults = await Promise.all(images.map((image) => deleteR2Object(image.objectKey)));
      if (deletionResults.some((deleted) => !deleted)) {
        return NextResponse.json(
          { success: false, error: "Image cleanup failed; listing was not deleted" },
          { status: 502 }
        );
      }
      const product = await prisma.product.delete({
        where: { id: targetId },
      });

      await prisma.activityLog.create({
        data: {
          actionType: "STATUS_UPDATED",
          title: `Listing Deleted`,
          description: `Admin removed listing "${product.title}"`,
          actorName: adminName,
          actorRole: "ADMIN",
        },
      });

      return NextResponse.json({ success: true, data: product });
    }

    if (action === "UPDATE_QUOTE_STATUS") {
      if (!QUOTE_STATUSES.has(value)) {
        return NextResponse.json({ success: false, error: "Invalid quote status" }, { status: 400 });
      }
      const quote = await prisma.serviceRequest.update({
        where: { id: targetId },
        data: { status: value },
      });

      await prisma.activityLog.create({
        data: {
          actionType: "STATUS_UPDATED",
          title: `Prototyping Quote Updated to ${value}`,
          description: `Admin updated quote #${quote.id} (${quote.title})`,
          actorName: adminName,
          actorRole: "ADMIN",
        },
      });

      return NextResponse.json({ success: true, data: quote });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/moderate error:", error);
    return NextResponse.json({ success: false, error: "Moderation action failed" }, { status: 500 });
  }
}
