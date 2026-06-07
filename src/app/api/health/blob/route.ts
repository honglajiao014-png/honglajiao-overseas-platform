import { NextResponse } from "next/server";

/**
 * Blob 存储健康检查端点
 * 前端在提交车辆前调用此端点，确认 Blob 服务可用
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  // 1. 检查 BLOB_READ_WRITE_TOKEN
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token && token.length > 10) {
    checks.token = { ok: true, detail: `已配置 (${token.length} 字符)` };
  } else {
    const oidcToken = process.env.VERCEL_OIDC_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;
    if (oidcToken && storeId) {
      checks.token = { ok: true, detail: `OIDC 模式 (store: ${storeId})` };
    } else {
      checks.token = {
        ok: false,
        detail: "未配置 BLOB_READ_WRITE_TOKEN 且 OIDC 不完整。请检查环境变量。",
      };
    }
  }

  // 2. 检查 BLOB_STORE_ID
  const storeId = process.env.BLOB_STORE_ID;
  checks.storeId = {
    ok: !!storeId,
    detail: storeId || "未配置 BLOB_STORE_ID",
  };

  // 3. 尝试列出 Blob 文件（验证 token 有效性）
  let blobReachable = false;
  let blobDetail = "";
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ limit: 1 });
    blobReachable = true;
    blobDetail = `正常 (${result.blobs.length} 个文件)`;
  } catch (e: any) {
    blobDetail = `不可达: ${e?.message || "未知错误"}`;
  }
  checks.blobApi = { ok: blobReachable, detail: blobDetail };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
