// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, code, name, password } = await req.json();
    if (!email || !code || !name || !password) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // Find valid verification code
    const record = await prisma.verificationCode.findFirst({
      where: { email, code, used: false, expiresAt: { gt: new Date() } },
    });
    if (!record) {
      return NextResponse.json({ error: "验证码无效或已过期" }, { status: 400 });
    }

    // Mark code as used
    await prisma.verificationCode.update({ where: { id: record.id }, data: { used: true } });

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashPassword(password), name, role: "dealer" },
    });

    const token = signToken({ userId: user.id, role: user.role });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
