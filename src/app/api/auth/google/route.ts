import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";

interface GoogleTokenInfo {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbSchema();

    const { credential } = await request.json();
    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!credential || !clientId) {
      return NextResponse.json(
        { success: false, error: "Google sign-in is not configured" },
        { status: 400 }
      );
    }

    const verificationResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );

    if (!verificationResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid Google credential" },
        { status: 401 }
      );
    }

    const tokenInfo = (await verificationResponse.json()) as GoogleTokenInfo;

    const cleanAud = tokenInfo.aud?.trim();
    const cleanClientId = clientId.trim();

    if (
      cleanAud !== cleanClientId ||
      tokenInfo.email_verified !== "true" ||
      !tokenInfo.email ||
      !tokenInfo.sub
    ) {
      return NextResponse.json(
        { success: false, error: "Google credential verification failed" },
        { status: 401 }
      );
    }

    const cleanEmail = tokenInfo.email.toLowerCase().trim();

    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        fullName: tokenInfo.name || undefined,
        avatarUrl: tokenInfo.picture || undefined,
      },
      create: {
        fullName: tokenInfo.name || cleanEmail.split("@")[0],
        email: cleanEmail,
        phoneNumber: `google:${tokenInfo.sub}`,
        university: "Google Account",
        gender: "unspecified",
        avatarUrl: tokenInfo.picture || null,
        avatarColor: "cyan",
        city: "Islamabad",
      },
    });

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      university: user.university,
      campus: user.campus,
      gender: user.gender,
      isPhoneVerified: user.isPhoneVerified,
      isVerifiedStudent: user.isVerifiedStudent,
      city: user.city,
      avatarUrl: user.avatarUrl,
      avatarColor: user.avatarColor,
      rating: user.rating,
      dealsCompleted: user.dealsCompleted,
      role: user.role,
    };

    return NextResponse.json({
      success: true,
      data: {
        user: safeUser,
      },
      user: safeUser,
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to sign in with Google" },
      { status: 500 }
    );
  }
}
