import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const [
      totalVehicles,
      soldVehicles,
      availableVehicles,
      totalUsers,
      newInquiries,
      completedOrders,
      totalSpecs,
      submittedVehicles,
      approvedPublishedVehicles,
      dealerCount,
      todayVehicles,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { deleted: false } }),
      prisma.vehicle.count({ where: { status: "sold", deleted: false } }),
      prisma.vehicle.count({ where: { status: "available", deleted: false } }),
      prisma.user.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.vehicleSpec.count(),
      prisma.vehicle.count({ where: { status: "SUBMITTED", deleted: false } }),
      prisma.vehicle.count({ where: { status: { in: ["APPROVED", "PUBLISHED"] }, deleted: false } }),
      prisma.user.count({ where: { role: "DEALER" } }),
      prisma.vehicle.count({ where: { createdAt: { gte: todayStart, lt: todayEnd }, deleted: false } }),
    ]);

    // 计算总利润
    const profitAgg = await prisma.order.aggregate({
      _sum: { profit: true },
      where: { status: "completed" },
    });
    const totalProfit = profitAgg._sum.profit || 0;

    return NextResponse.json({
      totalVehicles,
      soldVehicles,
      availableVehicles,
      totalUsers,
      newInquiries,
      completedOrders,
      totalProfit,
      totalSpecs,
      submittedVehicles,
      approvedPublishedVehicles,
      dealerCount,
      todayVehicles,
    });
  } catch (e) {
    console.error("Stats API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
