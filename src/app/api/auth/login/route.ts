import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Email or phone number is required" },
        { status: 400 }
      );
    }

    // Lookup user by email or phone
    const cleanPhone = identifier.replace(/[^0-9+]/g, "");
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase().trim() },
          { phoneNumber: cleanPhone },
          { phoneNumber: identifier },
        ],
      },
    });

    if (!user) {
      // If user not found in dev, create or return demo
      return NextResponse.json(
        { success: false, error: "Account not found with this email or phone" },
        { status: 404 }
      );
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      university: user.university,
      campus: user.campus || "",
      isVerifiedStudent: user.isVerifiedStudent,
      rating: user.rating,
      dealsCompleted: user.dealsCompleted,
      avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: user.city,
    };

    return NextResponse.json({ success: true, data: { user: safeUser, token: "mock_jwt_session_token" } });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
