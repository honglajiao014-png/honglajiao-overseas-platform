// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 诊断接口：检查被标记删除的车辆
 * GET /api/admin/check-deleted
 *
 * 不需要鉴权，纯诊断用。
 * 用来快速验证有没有被 sync 复活的车辆。
 */
export async function GET() {
  try {
    const [deletedCount, totalVehicles, recentDeleted] = await Promise.all([
      prisma.vehicle.count({ where: { deleted: true } }),
      prisma.vehicle.count(),
      prisma.vehicle.findMany({
        where: { deleted: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          slug: true,
          brand: true,
          model: true,
          sourceId: true,
          deleted: true,
          updatedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      totalVehicles,
      deletedCount,
      recentDeleted,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "查询失败" },
      { status: 500 }
    );
  }
}
