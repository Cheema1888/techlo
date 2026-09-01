import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch aggregate metrics
    const [totalUsers, verifiedStudents, totalProducts, activeQuotes, totalChats, activityLogs, recentUsers, recentProducts, recentQuotes] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerifiedStudent: true } }),
      prisma.product.count(),
      prisma.serviceRequest.count(),
      prisma.chatMessage.count(),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          university: true,
          campus: true,
          isVerifiedStudent: true,
          avatarUrl: true,
          avatarColor: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          seller: {
            select: { fullName: true, university: true, phoneNumber: true },
          },
        },
      }),
      prisma.serviceRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          verifiedStudents,
          totalProducts,
          activeQuotes,
          totalChats,
        },
        activityLogs,
        recentUsers,
        recentProducts,
        recentQuotes,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
