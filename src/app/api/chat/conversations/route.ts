import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch conversations for a specific user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        product: true,
        buyer: {
          select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true, phoneNumber: true },
        },
        seller: {
          select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true, phoneNumber: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error: any) {
    console.error("GET /api/chat/conversations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create or retrieve existing conversation
export async function POST(req: NextRequest) {
  try {
    const { buyerId, sellerId, productId } = await req.json();

    if (!buyerId || !sellerId) {
      return NextResponse.json({ success: false, error: "buyerId and sellerId are required" }, { status: 400 });
    }

    if (buyerId === sellerId) {
      return NextResponse.json({ success: false, error: "Cannot chat with yourself" }, { status: 400 });
    }

    // Check if conversation already exists for this pair + product
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { buyerId, sellerId, productId: productId || null },
          { buyerId: sellerId, sellerId: buyerId, productId: productId || null },
        ],
      },
      include: {
        product: true,
        buyer: {
          select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true },
        },
        seller: {
          select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          buyerId,
          sellerId,
          productId: productId || null,
        },
        include: {
          product: true,
          buyer: {
            select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true },
          },
          seller: {
            select: { id: true, fullName: true, university: true, avatarUrl: true, avatarColor: true },
          },
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      // Log activity
      try {
        await prisma.activityLog.create({
          data: {
            actionType: "CHAT_STARTED",
            title: "New Chat Started",
            description: `${conversation.buyer.fullName} started a chat with ${conversation.seller.fullName}`,
            actorName: conversation.buyer.fullName,
            metadataJson: JSON.stringify({ conversationId: conversation.id, productId }),
          },
        });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, data: conversation });
  } catch (error: any) {
    console.error("POST /api/chat/conversations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
