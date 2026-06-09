import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { Vehicle: { select: { brand: true, model: true, year: true, basePrice: true } } },
  });
  return NextResponse.json({ orders });
}
