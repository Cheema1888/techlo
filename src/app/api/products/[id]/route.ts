import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            university: true,
            campus: true,
            isVerifiedStudent: true,
            rating: true,
            dealsCompleted: true,
            avatarUrl: true,
            avatarColor: true,
            city: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Increment views count
    await prisma.product.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    const publicPhone = product.showPhoneNumber
      ? normalizeWhatsappNumber(product.seller.phoneNumber)
      : undefined;

    const formatted = {
      id: product.id,
      title: product.title,
      category: product.category,
      condition: product.condition,
      pricePkr: product.pricePkr,
      originalPricePkr: product.originalPricePkr,
      isNegotiable: product.isNegotiable,
      showPhoneNumber: product.showPhoneNumber ?? true,
      images: JSON.parse(product.imagesJson || "[]"),
      description: product.description,
      specs: product.specsJson ? JSON.parse(product.specsJson) : {},
      quantityAvailable: product.quantityAvailable,
      status: product.status,
      location: product.location,
      city: product.city,
      viewsCount: product.viewsCount + 1,
      createdAt: product.createdAt.toISOString(),
      seller: {
        id: product.seller.id,
        name: product.seller.fullName,
        phone: publicPhone || undefined,
        phoneNumber: publicPhone || undefined,
        university: product.seller.university,
        campus: product.seller.campus || "",
        isVerifiedStudent: product.seller.isVerifiedStudent,
        rating: product.seller.rating,
        dealsCompleted: product.seller.dealsCompleted,
        avatarUrl: product.seller.avatarUrl || "",
        avatarColor: product.seller.avatarColor || "cyan",
        city: product.seller.city,
      },
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Unable to load listing" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const { id } = await params;
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update a listing" },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, sellerId: true, title: true, status: true, soldAt: true },
    });
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    if (product.sellerId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Only the seller can update this listing" },
        { status: 403 }
      );
    }

    const { status } = await req.json();
    if (status !== "sold" && status !== "available") {
      return NextResponse.json(
        { success: false, error: "Status must be either sold or available" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        status,
        soldAt:
          status === "sold"
            ? product.status === "sold"
              ? product.soldAt || new Date()
              : new Date()
            : null,
      },
    });

    try {
      await prisma.activityLog.create({
        data: {
          actionType: "STATUS_UPDATED",
          title: status === "sold" ? "Hardware Marked as Sold" : "Hardware Relisted",
          description: `Seller changed "${product.title}" from ${product.status} to ${status}`,
          actorName: session.email || "Student Seller",
          actorRole: session.role || "STUDENT",
          metadataJson: JSON.stringify({ productId: product.id, previousStatus: product.status, status }),
        },
      });
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Unable to update listing" }, { status: 500 });
  }
}
