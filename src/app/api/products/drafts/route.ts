import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const session = getServerSession(req);

    // If cookie not found, allow client to pass token in body or headers
    let userId = session?.userId;
    if (!userId) {
      try {
        const body = await req.json();
        userId = body?.userId;
      } catch {}
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to create a listing draft" },
        { status: 401 }
      );
    }

    const draftId = `draft_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

    return NextResponse.json({
      success: true,
      data: {
        draftId,
        expiresAt,
      },
    });
  } catch (error: any) {
    console.error("POST /api/products/drafts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
