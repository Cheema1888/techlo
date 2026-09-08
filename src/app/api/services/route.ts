import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDbSchema } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { isSuperAdminEmail } from "@/lib/admin";

const SERVICE_TYPES = new Set([
  "pcb_design",
  "pcb_fabrication",
  "cad_3d_modeling",
  "3d_printing",
  "firmware_embedded",
]);

export async function GET(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const status = searchParams.get("status");

    const where: any = isSuperAdminEmail(session.email) ? {} : { userId: session.userId };
    if (serviceType && serviceType !== "all") {
      where.serviceType = serviceType;
    }
    if (status && status !== "all") {
      where.status = status;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      serviceType: r.serviceType,
      title: r.title,
      description: r.description,
      clientName: r.clientName,
      clientUniversity: r.clientUniversity,
      clientPhone: r.clientPhone,
      files: r.filesJson ? JSON.parse(r.filesJson) : [],
      estimatedCostPkr: r.estimatedCostPkr,
      status: r.status,
      deadline: r.deadline,
      customSpecs: r.customSpecsJson ? JSON.parse(r.customSpecsJson) : {},
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ success: false, error: "Unable to load service requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    await ensureDbSchema();
    const body = await req.json();
    const {
      serviceType,
      title,
      description,
      files,
      estimatedCostPkr,
      deadline,
      customSpecs,
    } = body;

    if (!SERVICE_TYPES.has(serviceType) || typeof title !== "string" || typeof description !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing mandatory fields for service quotation request" },
        { status: 400 }
      );
    }
    if (title.trim().length < 3 || title.trim().length > 120 || description.trim().length > 5000) {
      return NextResponse.json({ success: false, error: "Service request content is invalid or too long" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 401 });
    }
    const budget = Number(estimatedCostPkr || 0);
    if (!Number.isFinite(budget) || budget < 0 || budget > 100_000_000) {
      return NextResponse.json({ success: false, error: "Invalid estimated budget" }, { status: 400 });
    }
    const safeFiles = Array.isArray(files) ? files.slice(0, 10) : [];

    const created = await prisma.serviceRequest.create({
      data: {
        serviceType,
        title,
        description: description || "",
        clientName: user.fullName,
        clientUniversity: user.university,
        clientPhone: user.phoneNumber,
        filesJson: safeFiles.length ? JSON.stringify(safeFiles) : null,
        estimatedCostPkr: budget,
        status: "submitted",
        deadline: deadline || null,
        customSpecsJson: customSpecs ? JSON.stringify(customSpecs) : null,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ success: false, error: "Unable to submit service request" }, { status: 500 });
  }
}
