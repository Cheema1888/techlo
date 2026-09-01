import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phoneNumber, university, campus, eduEmail, city } = await req.json();

    if (!fullName || !email || !phoneNumber || !university) {
      return NextResponse.json(
        { success: false, error: "All required registration fields must be filled" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");

    // Upsert or register pending user
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        fullName,
        phoneNumber: cleanPhone,
        university,
        campus: campus || null,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        city: city || "Islamabad",
      },
      create: {
        fullName,
        email: email.toLowerCase().trim(),
        phoneNumber: cleanPhone,
        university,
        campus: campus || null,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        isPhoneVerified: false,
        isVerifiedStudent: email.toLowerCase().endsWith(".edu.pk") || (eduEmail && eduEmail.includes(".edu.pk")),
        city: city || "Islamabad",
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      },
    });

    console.log(`[SMS GATEWAY SIMULATOR] Sent OTP ${generatedOtp} to ${cleanPhone}`);

    return NextResponse.json({
      success: true,
      message: "SMS OTP generated and sent to mobile phone",
      data: {
        userId: user.id,
        phoneNumber: cleanPhone,
        otpCode: generatedOtp, // returned for live simulation in dev/demo
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
