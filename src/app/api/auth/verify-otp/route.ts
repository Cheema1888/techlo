import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { attachSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const { phoneNumber, email, otpCode, expectedOtp, fullName, university, gender } = await req.json();

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

    // Check code matches: database code, session generated code, or master demo bypass 123456
    const isMasterDemoCode = cleanInputCode === "123456";
    const isMatchingDbCode = user?.otpCode && user.otpCode.trim() === cleanInputCode;
    const isMatchingExpected = expectedOtp && expectedOtp.toString().trim() === cleanInputCode;

    const isCodeValid = isMasterDemoCode || isMatchingDbCode || isMatchingExpected;

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code entered" },
        { status: 400 }
      );
    }

    // If user record wasn't found (e.g. cross-instance serverless lambda cold start), create it now
    if (!user) {
      user = await prisma.user.upsert({
        where: { phoneNumber: cleanPhone || `temp_${Date.now()}` },
        update: {
          email: cleanEmail,
          isPhoneVerified: true,
          otpCode: null,
        },
        create: {
          fullName: fullName || "Student",
          email: cleanEmail || `student_${Date.now()}@techlo.store`,
          phoneNumber: cleanPhone || `+923000000000`,
          university: university || "Pakistani University",
          gender: gender || "unspecified",
          isPhoneVerified: true,
          otpCode: null,
        },
      });
    } else {
      // Mark verified in DB
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          isPhoneVerified: true,
          otpCode: null,
        },
      });
    }

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
