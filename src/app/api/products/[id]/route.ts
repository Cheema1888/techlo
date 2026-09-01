import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            university: true,
            campus: true,
            isVerifiedStudent: true,
            rating: true,
            dealsCompleted: true,
            avatarUrl: true,
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

    const formatted = {
      id: product.id,
      title: product.title,
      category: product.category,
      condition: product.condition,
      pricePkr: product.pricePkr,
      originalPricePkr: product.originalPricePkr,
      isNegotiable: product.isNegotiable,
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
        email: product.seller.email,
        phone: product.seller.phoneNumber,
        university: product.seller.university,
        campus: product.seller.campus || "",
        isVerifiedStudent: product.seller.isVerifiedStudent,
        rating: product.seller.rating,
        dealsCompleted: product.seller.dealsCompleted,
        avatarUrl: product.seller.avatarUrl || "",
        city: product.seller.city,
      },
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
