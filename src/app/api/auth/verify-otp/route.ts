import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, email, otpCode } = await req.json();

    if ((!phoneNumber && !email) || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Identifier (Phone or Email) and OTP code are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9+]/g, "") : "";
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanPhone ? [{ phoneNumber: cleanPhone }, { phoneNumber }] : []),
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User record not found" },
        { status: 404 }
      );
    }

    // Verify OTP (allow valid database code or master developer bypass 123456)
    const isMasterDemoCode = otpCode === "123456";
    const isMatchingDbCode = user.otpCode === otpCode;

    if (!isMasterDemoCode && !isMatchingDbCode) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code entered" },
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
      gender: updatedUser.gender || "unspecified",
      isVerifiedStudent: updatedUser.isVerifiedStudent,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl || undefined,
      avatarColor: updatedUser.avatarColor || "cyan",
    };

    return NextResponse.json({
      success: true,
      message: "Account verified successfully",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("POST /api/auth/verify-otp error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
