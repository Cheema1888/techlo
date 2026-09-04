import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { isApprovedImageUrl } from "@/lib/r2";
import { getServerSession } from "@/lib/session";

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
      draftId,
    } = body;

    if (!title || !category || !condition || !pricePkr || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for hardware listing" },
        { status: 400 }
      );
    }

    const session = getServerSession(req);

    // 1. Strictly enforce max 4 images per listing
    const imageList: string[] = Array.isArray(images) ? images : [];
    if (imageList.length > 4) {
      return NextResponse.json(
        { success: false, error: "Maximum of 4 photos allowed per advertisement" },
        { status: 400 }
      );
    }

    // 2. Strictly reject base64 data URLs & validate approved image domains
    for (const imgUrl of imageList) {
      if (typeof imgUrl === "string" && imgUrl.startsWith("data:")) {
        return NextResponse.json(
          {
            success: false,
            error: "Base64 image data is not permitted. All photos must be uploaded to Cloudflare R2.",
          },
          { status: 400 }
        );
      }
      if (!isApprovedImageUrl(imgUrl)) {
        return NextResponse.json(
          {
            success: false,
            error: `Image URL not from an approved delivery domain: ${imgUrl}`,
          },
          { status: 400 }
        );
      }
    }

    // Default to session user or provided sellerId or first user
    let finalSellerId = session?.userId || sellerId;
    if (!finalSellerId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ success: false, error: "No user found in database" }, { status: 400 });
      }
      finalSellerId = defaultUser.id;
    }

    const finalImages =
      imageList.length > 0
        ? imageList
        : ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"];

    const createdProduct = await prisma.product.create({
      data: {
        title,
        category,
        condition,
        pricePkr: parseFloat(pricePkr),
        originalPricePkr: originalPricePkr ? parseFloat(originalPricePkr) : null,
        isNegotiable: Boolean(isNegotiable),
        showPhoneNumber: Boolean(showPhoneNumber),
        imagesJson: JSON.stringify(finalImages),
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

    // Attach confirmed ProductImage records to this newly created product
    if (draftId) {
      try {
        await prisma.productImage.updateMany({
          where: {
            draftId,
            status: { in: ["pending", "uploaded"] },
          },
          data: {
            status: "attached",
            productId: createdProduct.id,
          },
        });
      } catch (attachErr) {
        console.error("Failed to attach draft images:", attachErr);
      }
    }

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
