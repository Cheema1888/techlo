import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password, university } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Phone number or email is required to sign in" },
        { status: 400 }
      );
    }

    const cleanPhone = identifier.replace(/[^0-9+]/g, "").trim();

    // Query SQLite database for matching user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: cleanPhone },
          { phoneNumber: identifier },
          { email: identifier.toLowerCase().trim() },
        ],
      },
    });

    // If user not found but provided a valid phone and university, auto-create a verified real account in DB
    if (!user && cleanPhone.length >= 10 && university) {
      user = await prisma.user.create({
        data: {
          fullName: "Student " + cleanPhone.slice(-4),
          email: `${cleanPhone.replace(/\D/g, "")}@student.pk`,
          phoneNumber: cleanPhone,
          passwordHash: password || "student123",
          university: university,
          campus: `${university} Campus`,
          isPhoneVerified: true,
          city: "Islamabad",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this phone number or email. Please register with your university." },
        { status: 404 }
      );
    }

    // Update university if provided during login
    if (university && user.university !== university) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { university, campus: `${university} Campus` },
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      university: user.university,
      campus: user.campus || `${user.university} Campus`,
      isVerifiedStudent: user.isVerifiedStudent,
      rating: user.rating,
      dealsCompleted: user.dealsCompleted,
      avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: user.city,
    };

    return NextResponse.json({
      success: true,
      message: `Signed in as ${user.fullName} (${user.university})`,
      data: { user: safeUser, token: `jwt_${user.id}_${Date.now()}` },
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
