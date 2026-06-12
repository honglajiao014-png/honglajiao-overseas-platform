import { NextResponse } from "next/server";

/**
 * 综合健康检查端点 (honglajiao1688.com)
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string; latencyMs?: number }> = {};
  const startTime = Date.now();

  // 1. 数据库
  try {
    const dbStart = Date.now();
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { ok: true, detail: "连接正常", latencyMs: Date.now() - dbStart };
  } catch (e: any) {
    checks.database = { ok: false, detail: `连接失败: ${e?.message || "未知错误"}` };
  }

  // 2. Blob 存储
  try {
    const blobStart = Date.now();
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;
    if (!token && !(process.env.VERCEL_OIDC_TOKEN && storeId)) {
      checks.blob = { ok: false, detail: "未配置 Blob 凭证" };
    } else {
      const { list } = await import("@vercel/blob");
      await list({ limit: 1 });
      checks.blob = { ok: true, detail: `正常 (store: ${storeId || "从 token 解析"})`, latencyMs: Date.now() - blobStart };
    }
  } catch (e: any) {
    checks.blob = { ok: false, detail: `不可达: ${e?.message || "未知错误"}` };
  }

  // 3. SMTP（海外站可选）
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpHost || smtpPort || smtpUser || smtpPass) {
    const ok = !!(smtpHost && smtpPort && smtpUser && smtpPass);
    checks.smtp = { ok, detail: ok ? `已配置 (${smtpHost}:${smtpPort})` : "配置不完整" };
  } else {
    checks.smtp = { ok: true, detail: "未配置（海外站不需要邮件服务）" };
  }

  // 4. JWT
  checks.jwt = {
    ok: !!(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 8),
    detail: process.env.JWT_SECRET ? `已配置 (${process.env.JWT_SECRET.length} 字符)` : "未配置",
  };

  // 5. Google OAuth
  const gid = process.env.GOOGLE_CLIENT_ID;
  const gsecret = process.env.GOOGLE_CLIENT_SECRET;
  checks.googleOAuth = {
    ok: !!(gid && gsecret),
    detail: gid && gsecret ? `已配置` : "配置不完整",
  };

  // 6. 内存
  const mem = process.memoryUsage();
  const used = Math.round(mem.heapUsed / 1024 / 1024);
  const total = Math.round(mem.heapTotal / 1024 / 1024);
  checks.memory = {
    ok: used / total < 0.95,
    detail: `堆 ${used}MB / ${total}MB, RSS ${Math.round(mem.rss / 1024 / 1024)}MB`,
  };

  // 7. 环境
  checks.environment = {
    ok: true,
    detail: `Node.js ${process.version}, Vercel: ${process.env.VERCEL || "本地"}, 环境: ${process.env.VERCEL_ENV || "development"}`,
  };

  const allOk = Object.values(checks).every((c) => c.ok);
  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", timestamp: new Date().toISOString(), latencyMs: Date.now() - startTime, checks },
    { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

