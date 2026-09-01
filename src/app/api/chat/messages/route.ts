import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch messages for a conversation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "conversationId required" }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Send a message in a conversation
export async function POST(req: NextRequest) {
  try {
    const { conversationId, senderId, content } = await req.json();

    if (!conversationId || !senderId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "conversationId, senderId, and content are required" },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId,
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
