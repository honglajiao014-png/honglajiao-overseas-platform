import { NextResponse } from "next/server";

/**
 * 综合健康检查端点 (honglajiao1688.com)
 * 检查所有关键服务的可用性：数据库、Blob 存储、JWT、内存
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string; latencyMs?: number }> = {};
  const startTime = Date.now();

  // 1. 数据库连接检查
  try {
    const dbStart = Date.now();
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      ok: true,
      detail: "连接正常",
      latencyMs: Date.now() - dbStart,
    };
  } catch (e: any) {
    checks.database = {
      ok: false,
      detail: `连接失败: ${e?.message || "未知错误"}`,
    };
  }

  // 2. Blob 存储检查
  try {
    const blobStart = Date.now();
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;
    if (!token && !(process.env.VERCEL_OIDC_TOKEN && storeId)) {
      checks.blob = {
        ok: false,
        detail: "未配置 Blob 凭证（BLOB_READ_WRITE_TOKEN 或 OIDC）",
      };
    } else {
      const { list } = await import("@vercel/blob");
      await list({ limit: 1 });
      checks.blob = {
        ok: true,
        detail: `正常 (store: ${storeId || "从 token 解析"})`,
        latencyMs: Date.now() - blobStart,
      };
    }
  } catch (e: any) {
    checks.blob = {
      ok: false,
      detail: `不可达: ${e?.message || "未知错误"}`,
    };
  }

  // 3. JWT 密钥检查
  checks.jwt = {
    ok: !!(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 8),
    detail: process.env.JWT_SECRET
      ? `已配置 (${process.env.JWT_SECRET.length} 字符)`
      : "未配置 JWT_SECRET",
  };

  // 4. Google OAuth 检查
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  checks.googleOAuth = {
    ok: !!(googleId && googleSecret),
    detail: googleId && googleSecret
      ? `已配置 (Client ID: ${googleId.substring(0, 20)}...)`
      : `配置不完整，缺少: ${[!googleId && "GOOGLE_CLIENT_ID", !googleSecret && "GOOGLE_CLIENT_SECRET"].filter(Boolean).join(", ")}`,
  };

  // 5. 内存使用（Serverless 环境下堆通常接近上限，放宽到 95%）
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapRatio = heapUsedMB / heapTotalMB;
  checks.memory = {
    ok: heapRatio < 0.95,
    detail: `堆 ${heapUsedMB}MB / ${heapTotalMB}MB (${Math.round(heapRatio * 100)}%), RSS ${Math.round(memUsage.rss / 1024 / 1024)}MB`,
  };

  // 6. 运行环境
  checks.environment = {
    ok: true,
    detail: `Node.js ${process.version}, Vercel: ${process.env.VERCEL || "本地"}, 环境: ${process.env.VERCEL_ENV || "development"}`,
  };

  const allOk = Object.values(checks).every((c) => c.ok);
  const totalLatency = Date.now() - startTime;

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      latencyMs: totalLatency,
      checks,
    },
    {
      status: allOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
