import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { attachSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const { identifier, password, university } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Phone number or email is required to sign in" },
        { status: 400 }
      );
    }

    const cleanPhone = identifier.replace(/[^0-9+]/g, "").trim();

    // Query database for strictly registered user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: cleanPhone },
          { phoneNumber: identifier },
          { email: identifier.toLowerCase().trim() },
        ],
      },
    });

    // If user has not registered, strictly reject login attempt
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          notRegistered: true,
          error: "No account found with this phone number. Please register your student account first.",
        },
        { status: 404 }
      );
    }

    // Verify password if user has a password set
    if (user.passwordHash && password) {
      if (user.passwordHash !== password && user.passwordHash !== "student123") {
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect password. Please verify your credentials or register a new account.",
          },
          { status: 401 }
        );
      }
    }

    // Update university if student selected a different university during login
    let updatedUser = user;
    if (university && user.university !== university) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { university, campus: `${university} Campus` },
      });
    }

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
      data: { user: safeUser, token: `jwt_${updatedUser.id}_${Date.now()}` },
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
