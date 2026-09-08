import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { attachSessionCookie } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const { identifier, password } = await req.json();

    if (!identifier || typeof identifier !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number/email and password are required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeWhatsappNumber(identifier);
    const cleanPhone = normalizedPhone ? `+${normalizedPhone}` : identifier.replace(/[^0-9+]/g, "").trim();

    // Query database for strictly registered user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: cleanPhone },
          { email: identifier.toLowerCase().trim() },
        ],
      },
    });

    // If user has not registered, strictly reject login attempt
    if (!user) {
      return NextResponse.json({ success: false, error: "Incorrect sign-in credentials" }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Password sign-in is unavailable for this account. Use Google sign-in." },
        { status: 401 }
      );
    }

    if (user.loginLockedUntil && user.loginLockedUntil.getTime() > Date.now()) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const passwordResult = verifyPassword(password, user.passwordHash);
    if (!passwordResult.valid) {
      const nextAttempts = user.loginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: nextAttempts >= 5 ? 0 : nextAttempts,
          loginLockedUntil: nextAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });
      return NextResponse.json(
        { success: false, error: "Incorrect sign-in credentials" },
        { status: 401 }
      );
    }
    if (passwordResult.legacy) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashPassword(password) },
      });
    }
    if (user.loginAttempts || user.loginLockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, loginLockedUntil: null },
      });
    }

    const updatedUser = user;

    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      university: updatedUser.university,
      campus: updatedUser.campus || `${updatedUser.university} Campus`,
      gender: updatedUser.gender || "unspecified",
      isVerifiedStudent: updatedUser.isVerifiedStudent,
      rating: updatedUser.rating,
      dealsCompleted: updatedUser.dealsCompleted,
      avatarUrl: updatedUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: updatedUser.city,
    };

    const response = NextResponse.json({
      success: true,
      message: `Signed in as ${updatedUser.fullName} (${updatedUser.university})`,
      data: { user: safeUser },
      user: safeUser,
    });

    attachSessionCookie(response, {
      id: updatedUser.id,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: "Unable to sign in" }, { status: 500 });
  }
}
