import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET: Fetch messages for a conversation (last 14 days)
export async function GET(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "conversationId required" }, { status: 400 });
    }

    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: session.userId }, { sellerId: session.userId }],
      },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    await prisma.chatMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: session.userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.chatMessage.findMany({
      where: {
        conversationId,
        createdAt: { gte: fourteenDaysAgo },
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, avatarColor: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error("GET /api/chat/messages error:", error);
    return NextResponse.json({ success: false, error: "Unable to load messages" }, { status: 500 });
  }
}

// POST: Send a message in a conversation
export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();

    const { conversationId, content } = await req.json();

    if (typeof conversationId !== "string" || conversationId.length > 100 || typeof content !== "string" || !content.trim() || content.trim().length > 2000) {
      return NextResponse.json(
        { success: false, error: "conversationId and content are required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: session.userId }, { sellerId: session.userId }],
      },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    const recentMessageCount = await prisma.chatMessage.count({
      where: { senderId: session.userId, createdAt: { gte: new Date(Date.now() - 60_000) } },
    });
    if (recentMessageCount >= 20) {
      return NextResponse.json({ success: false, error: "Message rate limit exceeded" }, { status: 429 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, avatarColor: true },
        },
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error("POST /api/chat/messages error:", error);
    return NextResponse.json({ success: false, error: "Unable to send message" }, { status: 500 });
  }
}
