import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")?.split(" ")[1];
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { verifyToken } = await import("@/lib/auth");
    const payload = verifyToken(auth);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const [
      todayUsers,
      totalUsers,
      todayChatSessions,
      activeChatSessions,
      leadStats,
      emailSent,
      pendingVehicles,
      publishedVehicles,
      dealerCount,
      todayVehicles,
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: todayStart, lt: todayEnd } } }),
      prisma.user.count(),
      prisma.chatSession.count({ where: { createdAt: { gte: todayStart, lt: todayEnd } } }),
      prisma.chatSession.count({ where: { updatedAt: { gte: new Date(Date.now() - 3600000) } } }),
      prisma.customerLead.groupBy({
        by: ["intentLevel"],
        _count: { id: true },
      }),
      prisma.customerLead.count({ where: { emailSent: true } }),
      prisma.vehicle.count({ where: { status: "pending" } }),
      prisma.vehicle.count({ where: { published: true } }),
      prisma.user.count({ where: { role: "dealer" } }),
      prisma.vehicle.count({ where: { createdAt: { gte: todayStart, lt: todayEnd } } }),
    ]);

    const leadsByIntent: Record<number, number> = {};
    for (const row of leadStats) {
      leadsByIntent[row.intentLevel] = row._count.id;
    }

    return NextResponse.json({
      todayUsers,
      totalUsers,
      todayChatSessions,
      activeChatSessions,
      leadsByIntent,
      totalLeads: leadStats.reduce((s, r) => s + r._count.id, 0),
      emailSent,
      pendingVehicles,
      publishedVehicles,
      dealerCount,
      todayVehicles,
    });
  } catch (e) {
    console.error("Stats API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
