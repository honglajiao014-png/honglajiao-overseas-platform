// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")?.split(" ")[1];
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, phone, company, country, avatar } = await req.json();
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (company !== undefined) data.company = company;
    if (country !== undefined) data.country = country;
    if (avatar !== undefined) data.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data,
      select: { id: true, email: true, name: true, role: true, phone: true, company: true, country: true, avatar: true },
    });
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
