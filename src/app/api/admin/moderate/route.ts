import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { action, targetId, value, adminName = "Platform Admin" } = await req.json();

    if (!action || !targetId) {
      return NextResponse.json({ success: false, error: "action and targetId are required" }, { status: 400 });
    }

    if (action === "TOGGLE_USER_VERIFIED") {
      const user = await prisma.user.update({
        where: { id: targetId },
        data: { isVerifiedStudent: Boolean(value) },
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
      const product = await prisma.product.update({
        where: { id: targetId },
        data: { status: value },
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
