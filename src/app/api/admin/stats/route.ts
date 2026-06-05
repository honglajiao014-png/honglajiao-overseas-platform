import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalVehicles, soldVehicles, availableVehicles, totalUsers, totalInquiries, totalOrders, totalProfit] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "sold" } }),
    prisma.vehicle.count({ where: { status: "available" } }),
    prisma.user.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.order.count({ where: { status: "completed" } }),
    prisma.order.aggregate({ _sum: { profit: true }, where: { status: "completed" } }),
  ]);

  return NextResponse.json({
    totalVehicles,
    soldVehicles,
    availableVehicles,
    totalUsers,
    newInquiries: totalInquiries,
    completedOrders: totalOrders,
    totalProfit: totalProfit._sum.profit || 0,
  });
}
