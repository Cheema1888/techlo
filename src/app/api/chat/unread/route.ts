import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const count = await prisma.chatMessage.count({
      where: {
        isRead: false,
        senderId: { not: session.userId },
        conversation: {
          OR: [{ buyerId: session.userId }, { sellerId: session.userId }],
        },
      },
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("GET /api/chat/unread error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load unread messages" },
      { status: 500 }
    );
  }
}
