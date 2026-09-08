import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();

    const { studentIdOrEduEmail } = await req.json();
    const evidence = typeof studentIdOrEduEmail === "string" ? studentIdOrEduEmail.trim() : "";
    if (evidence.length < 5 || evidence.length > 200) {
      return NextResponse.json({ success: false, error: "Enter a valid university email or student ID" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { studentIdOrEduEmail: evidence, isVerifiedStudent: false },
      select: { id: true, studentIdOrEduEmail: true, isVerifiedStudent: true },
    });

    await prisma.activityLog.create({
      data: {
        actionType: "STATUS_UPDATED",
        title: "Student Verification Requested",
        description: "A student submitted verification evidence for administrator review",
        actorName: session.email || "Student",
        actorRole: session.role || "STUDENT",
        metadataJson: JSON.stringify({ userId: session.userId }),
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("POST /api/auth/request-verification error:", error);
    return NextResponse.json({ success: false, error: "Unable to submit verification request" }, { status: 500 });
  }
}
