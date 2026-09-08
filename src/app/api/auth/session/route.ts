import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }
  await ensureDbSchema();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      university: true,
      campus: true,
      gender: true,
      isPhoneVerified: true,
      isVerifiedStudent: true,
      city: true,
      avatarUrl: true,
      avatarColor: true,
      rating: true,
      dealsCompleted: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { user } });
}
