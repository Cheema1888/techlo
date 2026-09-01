import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, otpCode } = await req.json();

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: cleanPhone },
          { phoneNumber: phoneNumber },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User record not found" },
        { status: 404 }
      );
    }

    // Verify OTP (allow valid code or demo bypass 123456)
    const isMasterDemoCode = otpCode === "123456";
    const isMatchingDbCode = user.otpCode === otpCode;

    if (!isMasterDemoCode && !isMatchingDbCode) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP code entered" },
        { status: 400 }
      );
    }

    // Mark verified in DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        otpCode: null,
      },
    });

    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      university: updatedUser.university,
      campus: updatedUser.campus || "",
      isVerifiedStudent: updatedUser.isVerifiedStudent,
      rating: updatedUser.rating,
      dealsCompleted: updatedUser.dealsCompleted,
      avatarUrl: updatedUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: updatedUser.city,
    };

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully",
      data: { user: safeUser, token: "mock_jwt_session_token" },
    });
  } catch (error: any) {
    console.error("POST /api/auth/verify-otp error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
