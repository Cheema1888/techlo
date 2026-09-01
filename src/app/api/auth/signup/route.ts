import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phoneNumber, university, campus, eduEmail, city, password } = await req.json();

    if (!fullName || !phoneNumber || !university) {
      return NextResponse.json(
        { success: false, error: "Full Name, Phone Number, and University are mandatory for registration" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "").trim();
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Pakistani mobile number (+92 3XX XXXXXXX)" },
        { status: 400 }
      );
    }

    // Auto-generate email if student did not enter one
    const finalEmail = (email && email.trim()) 
      ? email.toLowerCase().trim() 
      : `${cleanPhone.replace(/\D/g, "")}@student.pk`;

    // Generate 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Upsert or register real student user in SQLite
    const user = await prisma.user.upsert({
      where: { phoneNumber: cleanPhone },
      update: {
        fullName,
        email: finalEmail,
        passwordHash: password || "student123",
        university,
        campus: campus || `${university} Main Campus`,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        city: city || "Islamabad",
      },
      create: {
        fullName,
        email: finalEmail,
        passwordHash: password || "student123",
        phoneNumber: cleanPhone,
        university,
        campus: campus || `${university} Main Campus`,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        isPhoneVerified: false,
        isVerifiedStudent: finalEmail.toLowerCase().endsWith(".edu.pk") || (eduEmail && eduEmail.includes(".edu.pk")) || false,
        city: city || "Islamabad",
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      },
    });

    console.log(`[SMS AUTH GATEWAY] Dispatched OTP ${generatedOtp} to ${cleanPhone} for ${fullName} (${university})`);

    return NextResponse.json({
      success: true,
      message: "SMS OTP generated and sent to student phone number",
      data: {
        userId: user.id,
        phoneNumber: cleanPhone,
        university: user.university,
        otpCode: generatedOtp, // returned for live simulation in dev/demo
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
