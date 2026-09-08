import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { generateSecureOtp, dispatchSmsOtp } from "@/lib/smsGateway";
import { dispatchEmailOtp } from "@/lib/emailGateway";
import { hashPassword, validatePassword } from "@/lib/password";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
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

    const normalizedPhone = normalizeWhatsappNumber(phoneNumber);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Pakistani mobile number (+92 3XX XXXXXXX)" },
        { status: 400 }
      );
    }
    const cleanPhone = `+${normalizedPhone}`;

    // Regular email validation (no university email requirement)
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid regular Email address is compulsory for verification" },
        { status: 400 }
      );
    }

    const finalEmail = email.toLowerCase().trim();
    const cleanGender = gender.toLowerCase().trim();
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ phoneNumber: cleanPhone }, { email: finalEmail }] },
    });
    if (existing?.isPhoneVerified) {
      return NextResponse.json(
        { success: false, error: "An account already exists with this phone number or email" },
        { status: 409 }
      );
    }
    if (existing && (existing.email !== finalEmail || existing.phoneNumber !== cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "An account already exists with this phone number or email" },
        { status: 409 }
      );
    }
    if (
      existing?.otpLastSentAt &&
      existing.otpLastSentAt.getTime() > Date.now() - 60 * 1000
    ) {
      return NextResponse.json(
        { success: false, error: "Please wait before requesting another verification code" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 2. Generate cryptographically secure 6-digit OTP code
    const generatedOtp = generateSecureOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Upsert or register student in database
    const accountData = {
        fullName: fullName.trim(),
        email: finalEmail,
        passwordHash: hashPassword(password),
        university,
        campus: campus || `${university} Main Campus`,
        gender: cleanGender,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
        city: city || "Islamabad",
        avatarUrl: avatarUrl || undefined,
        avatarColor: avatarColor || "cyan",
    };
    const user = existing
      ? await prisma.user.update({ where: { id: existing.id }, data: accountData })
      : await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: finalEmail,
        passwordHash: hashPassword(password),
        phoneNumber: cleanPhone,
        university,
        campus: campus || `${university} Main Campus`,
        gender: cleanGender,
        studentIdOrEduEmail: eduEmail || null,
        otpCode: generatedOtp,
        otpExpiresAt: otpExpires,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
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
    const emailResult = await dispatchEmailOtp(finalEmail, generatedOtp, user.fullName);
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "Unable to deliver the verification email. Please try again later." },
        { status: 502 }
      );
    }

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
        ...(process.env.NODE_ENV !== "production" ? { otpCode: generatedOtp } : {}),
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ success: false, error: "Unable to create account" }, { status: 500 });
  }
}
