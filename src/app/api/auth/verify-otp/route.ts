import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { attachSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const { phoneNumber, email, otpCode } = await req.json();

    const cleanInputCode = (otpCode || "").toString().trim();
    if ((!phoneNumber && !email) || !cleanInputCode) {
      return NextResponse.json(
        { success: false, error: "Identifier (Phone or Email) and OTP code are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9+]/g, "").trim() : "";
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanPhone ? [{ phoneNumber: cleanPhone }, { phoneNumber }] : []),
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    if (user.otpAttempts >= 5) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Request a new verification code." },
        { status: 429 }
      );
    }

    const isCodeValid = Boolean(
      user.otpCode &&
        user.otpExpiresAt &&
        user.otpExpiresAt.getTime() > Date.now() &&
        user.otpCode.trim() === cleanInputCode
    );

    if (!isCodeValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: { increment: 1 } },
      });
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      university: user.university,
      campus: user.campus || "",
      gender: user.gender || "unspecified",
      isVerifiedStudent: user.isVerifiedStudent,
      role: user.role,
      avatarUrl: user.avatarUrl || undefined,
      avatarColor: user.avatarColor || "cyan",
    };

    const response = NextResponse.json({
      success: true,
      message: "Account verified successfully",
      data: {
        user: safeUser,
      },
      user: safeUser,
    });

    attachSessionCookie(response, {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/verify-otp error:", error);
    return NextResponse.json({ success: false, error: "Unable to verify account" }, { status: 500 });
  }
}
