import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { verifyToken } = await import("@/lib/auth");
  const payload = verifyToken(auth);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.customerLead.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.customerLead.count(),
  ]);

  return NextResponse.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
}
