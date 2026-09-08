import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

// GET: Fetch conversations for a specific user
export async function GET(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();
    const userId = session.userId;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
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
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false, senderId: { not: userId } },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const data = conversations.map(({ _count, ...conversation }) => ({
      ...conversation,
      unreadCount: _count.messages,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/chat/conversations error:", error);
    return NextResponse.json({ success: false, error: "Unable to load conversations" }, { status: 500 });
  }
}

// POST: Create or retrieve existing conversation
export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();

    const { sellerId, productId } = await req.json();
    const buyerId = session.userId;

    if (!buyerId || !sellerId) {
      return NextResponse.json({ success: false, error: "buyerId and sellerId are required" }, { status: 400 });
    }

    if (buyerId === sellerId) {
      return NextResponse.json({ success: false, error: "Cannot chat with yourself" }, { status: 400 });
    }

    if (typeof sellerId !== "string" || sellerId.length > 100 || (productId && (typeof productId !== "string" || productId.length > 100))) {
      return NextResponse.json({ success: false, error: "Invalid conversation details" }, { status: 400 });
    }
    const seller = await prisma.user.findUnique({ where: { id: sellerId }, select: { id: true } });
    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }
    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId }, select: { sellerId: true } });
      if (!product || product.sellerId !== sellerId) {
        return NextResponse.json({ success: false, error: "Listing does not belong to this seller" }, { status: 400 });
      }
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
    return NextResponse.json({ success: false, error: "Unable to start conversation" }, { status: 500 });
  }
}
