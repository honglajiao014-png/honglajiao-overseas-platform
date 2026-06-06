import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Check if already registered
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old codes for this email
    await prisma.verificationCode.deleteMany({ where: { email, used: false } });

    // Store new code (10min expiry)
    await prisma.verificationCode.create({
      data: { email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });

    // Try sending email via Resend
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "noreply@honglajiao1688.com",
          to: email,
          subject: "红辣椒汽车出口 - 注册验证码",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2>红辣椒汽车出口</h2>
            <p>您的注册验证码为：</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:24px;background:#f5f5f5;border-radius:12px;margin:16px 0">${code}</div>
            <p style="color:#666">验证码有效期为 10 分钟，如非本人操作请忽略。</p>
          </div>`,
        });
        emailSent = true;
      } catch {
        // Email sending failed, fall through
      }
    }

    // Return code in dev for testing
    return NextResponse.json({
      success: true,
      emailSent,
      ...(process.env.NODE_ENV === "development" || process.env.VERCEL_ENV !== "production" ? { code } : {}),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
