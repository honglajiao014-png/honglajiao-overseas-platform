// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true, role: true, phone: true, company: true, country: true, avatar: true } });
  return NextResponse.json({ user });
}
