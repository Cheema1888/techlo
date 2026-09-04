import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureOtp, dispatchSmsOtp } from "@/lib/smsGateway";
import { dispatchEmailOtp } from "@/lib/emailGateway";

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      university,
      gender,
      campus,
      eduEmail,
      city,
      password,
      avatarUrl,
      avatarColor,
    } = await req.json();

    // 1. Mandatory validation: Name, University, Gender, Phone Number, and Email
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name is required for registration" },
        { status: 400 }
      );
    }

    if (!university || !university.trim()) {
      return NextResponse.json(
        { success: false, error: "Please select your Pakistani University" },
        { status: 400 }
      );
    }

    if (!gender || !gender.trim()) {
      return NextResponse.json(
        { success: false, error: "Gender selection is mandatory for registration" },
        { status: 400 }
      );
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      return NextResponse.json(
        { success: false, error: "Mobile Phone number is compulsory for registration" },
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

    // Regular email validation (no university email requirement)
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid regular Email address is compulsory for verification" },
        { status: 400 }
      );
    }

    const finalEmail = email.toLowerCase().trim();
    const cleanGender = gender.toLowerCase().trim();

    // 2. Generate cryptographically secure 6-digit OTP code
    const generatedOtp = generateSecureOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Upsert or register student in database
    const user = await prisma.user.upsert({
      where: { phoneNumber: cleanPhone },
      update: {
        fullName: fullName.trim(),
        email: finalEmail,
        passwordHash: password || "student123",
        university,
        campus: campus || `${university} Main Campus`,
        gender: cleanGender,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        city: city || "Islamabad",
        avatarUrl: avatarUrl || undefined,
        avatarColor: avatarColor || "cyan",
      },
      create: {
        fullName: fullName.trim(),
        email: finalEmail,
        passwordHash: password || "student123",
        phoneNumber: cleanPhone,
        university,
        campus: campus || `${university} Main Campus`,
        gender: cleanGender,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        isPhoneVerified: false,
        isVerifiedStudent: finalEmail.endsWith(".edu.pk") || false,
        city: city || "Islamabad",
        avatarUrl: avatarUrl || undefined,
        avatarColor: avatarColor || "cyan",
      },
    });

    // 4. Log Activity
    try {
      await prisma.activityLog.create({
        data: {
          actionType: "USER_SIGNUP",
          title: "New Student Registered",
          description: `${user.fullName} (${cleanGender}) registered from ${user.university} (${cleanPhone} / ${finalEmail})`,
          actorName: user.fullName,
          actorRole: "STUDENT",
          metadataJson: JSON.stringify({ userId: user.id, university: user.university, gender: cleanGender }),
        },
      });
    } catch (e) {}

    // 5. Dispatch OTP via Free Email Gateway (Resend)
    await dispatchEmailOtp(finalEmail, generatedOtp, user.fullName);

    // Also trigger SMS gateway if a real provider is set
    if (process.env.SMS_PROVIDER && process.env.SMS_PROVIDER !== "local") {
      await dispatchSmsOtp(cleanPhone, generatedOtp, "registration");
    }

    return NextResponse.json({
      success: true,
      message: `6-digit verification code sent to ${finalEmail}`,
      data: {
        userId: user.id,
        phoneNumber: cleanPhone,
        email: finalEmail,
        university: user.university,
        gender: cleanGender,
        otpCode: generatedOtp,
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
