/**
 * Vercel Cron Job: 定时从国内站同步车辆到海外站
 * GET /api/cron/sync
 * Authorization: Bearer <CRON_SECRET>
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.CRON_SECRET;

  if (!expected || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { apiSync: "", dbSync: "", errors: [] as string[] };

  // 方式1：通过海外站自己的 sync API（从 DOMESTIC_DB_URL 读取）
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/admin/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SYNC_API_KEY || "",
      },
      body: JSON.stringify({ exchangeRate: 6.8 }),
    });

    const data = await res.json();
    results.apiSync = `total=${data.total} success=${data.success} failed=${data.failed}`;
    if (data.error) results.errors.push(data.error);
  } catch (e: any) {
    results.errors.push(`API 同步异常: ${e.message}`);
  }

  console.log("[cron/sync]", JSON.stringify(results));
  return NextResponse.json(results);
}
