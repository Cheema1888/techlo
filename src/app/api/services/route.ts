import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const status = searchParams.get("status");

    const where: any = {};
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceType,
      title,
      description,
      clientName,
      clientUniversity,
      clientPhone,
      files,
      estimatedCostPkr,
      deadline,
      customSpecs,
      userId,
    } = body;

    if (!serviceType || !title || !clientName || !clientPhone) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory fields for service quotation request" },
        { status: 400 }
      );
    }

    const created = await prisma.serviceRequest.create({
      data: {
        serviceType,
        title,
        description: description || "",
        clientName,
        clientUniversity: clientUniversity || "Pakistani University",
        clientPhone,
        filesJson: files ? JSON.stringify(files) : null,
        estimatedCostPkr: estimatedCostPkr ? parseFloat(estimatedCostPkr) : 0,
        status: "submitted",
        deadline: deadline || null,
        customSpecsJson: customSpecs ? JSON.stringify(customSpecs) : null,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
