import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await ensureDbSchema();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const university = searchParams.get("university");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const maxPrice = searchParams.get("maxPrice");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (condition && condition !== "all") {
      where.condition = condition;
    }

    if (city && city !== "All Cities") {
      where.city = city;
    }

    if (maxPrice) {
      where.pricePkr = {
        lte: parseFloat(maxPrice),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (university && university !== "all") {
      where.seller = {
        university: { contains: university },
      };
    }

    if (verifiedOnly) {
      where.seller = {
        ...(where.seller || {}),
        isVerifiedStudent: true,
      };
    }

    const products = await prisma.product.findMany({
      where,
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
            avatarColor: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProducts = products.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      condition: p.condition,
      pricePkr: p.pricePkr,
      originalPricePkr: p.originalPricePkr,
      isNegotiable: p.isNegotiable,
      showPhoneNumber: p.showPhoneNumber ?? true,
      images: JSON.parse(p.imagesJson || "[]"),
      description: p.description,
      specs: p.specsJson ? JSON.parse(p.specsJson) : {},
      quantityAvailable: p.quantityAvailable,
      status: p.status,
      location: p.location,
      createdAt: p.createdAt.toISOString(),
      seller: {
        id: p.seller.id,
        name: p.seller.fullName,
        email: p.seller.email,
        phone: p.showPhoneNumber ? p.seller.phoneNumber : undefined,
        phoneNumber: p.showPhoneNumber ? p.seller.phoneNumber : undefined,
        university: p.seller.university,
        campus: p.seller.campus || "",
        isVerifiedStudent: p.seller.isVerifiedStudent,
        rating: p.seller.rating,
        dealsCompleted: p.seller.dealsCompleted,
        avatarUrl: p.seller.avatarUrl || "",
        avatarColor: p.seller.avatarColor || "cyan",
      },
    }));

    return NextResponse.json({ success: true, count: formattedProducts.length, data: formattedProducts });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const body = await req.json();
    const {
      title,
      category,
      condition,
      pricePkr,
      originalPricePkr,
      isNegotiable,
      showPhoneNumber = true,
      images,
      description,
      specs,
      quantityAvailable,
      location,
      city,
      sellerId,
    } = body;

    if (!title || !category || !condition || !pricePkr || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for hardware listing" },
        { status: 400 }
      );
    }

    // Default to first user if sellerId not provided
    let finalSellerId = sellerId;
    if (!finalSellerId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ success: false, error: "No user found in database" }, { status: 400 });
      }
      finalSellerId = defaultUser.id;
    }

    const createdProduct = await prisma.product.create({
      data: {
        title,
        category,
        condition,
        pricePkr: parseFloat(pricePkr),
        originalPricePkr: originalPricePkr ? parseFloat(originalPricePkr) : null,
        isNegotiable: Boolean(isNegotiable),
        showPhoneNumber: Boolean(showPhoneNumber),
        imagesJson: JSON.stringify(images || ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"]),
        description,
        specsJson: specs ? JSON.stringify(specs) : null,
        quantityAvailable: quantityAvailable ? parseInt(quantityAvailable) : 1,
        location: location || "Campus Pickup",
        city: city || "Islamabad",
        sellerId: finalSellerId,
      },
      include: {
        seller: true,
      },
    });

    // Log Activity
    try {
      await prisma.activityLog.create({
        data: {
          actionType: "PRODUCT_POSTED",
          title: "New Hardware Listed",
          description: `${createdProduct.seller.fullName} listed "${createdProduct.title}" for Rs. ${createdProduct.pricePkr.toLocaleString()}`,
          actorName: createdProduct.seller.fullName,
          actorRole: "STUDENT",
          metadataJson: JSON.stringify({ productId: createdProduct.id, category: createdProduct.category }),
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, data: createdProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
