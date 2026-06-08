#!/usr/bin/env node

/**
 * 国内站 → 海外站 同步脚本 (Node.js ESM 版)
 * 依赖: @neondatabase/serverless, fetch (Node 18+)
 *
 * 用法: node scripts/sync-domestic.mjs
 */

import { neon } from "@neondatabase/serverless";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 配置
const DOMESTIC_DB_URL = (process.env.HLJ9588_DATABASE_URL || process.env.DOMESTIC_DB_URL || "").replace(/^"|"$/g, "");
const OVERSEAS_API = process.env.OVERSEAS_API_URL || "http://localhost:3000/api/admin/sync";
const ADMIN_TOKEN = (process.env.SYNC_API_KEY || process.env.SYNC_KEY || "").replace(/^"|"$/g, "");

if (!DOMESTIC_DB_URL) {
  console.error("❌ 请设置 HLJ9588_DATABASE_URL 或 DOMESTIC_DB_URL 环境变量");
  process.exit(1);
}
if (!ADMIN_TOKEN) {
  console.error("❌ 请设置 SYNC_API_KEY 环境变量");
  process.exit(1);
}

// 清理连接串（neon() 不支持 channel_binding）
function cleanDbUrl(url) {
  url = url.replace(/^"|"$/g, "");
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    let result = u.toString();
    // URL.toString() 编码了一些字符，neon() 可能不接受，还原
    result = result.replace(/%(\w{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
    return result;
  } catch {
    return url.replace(/[?&]channel_binding=require/g, "");
  }
}
const CLEAN_DB_URL = cleanDbUrl(DOMESTIC_DB_URL);

async function fetchExchangeRate() {
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/CNY");
    const d = await r.json();
    if (d.result === "success" && d.rates?.USD) return 1 / d.rates.USD;
  } catch {}
  return 6.8;
}

function calcPrice(bp) {
  bp = Math.max(0, Number(bp));
  let r = 0;
  if (bp <= 5000) r = 0.45;
  else if (bp <= 10000) r = 0.35;
  else if (bp <= 20000) r = 0.28;
  else if (bp <= 50000) r = 0.22;
  else if (bp <= 100000) r = 0.18;
  else r = 0.15;
  const mk = Math.round(bp * r);
  return { basePrice: bp, markup: mk, salePrice: bp + mk, profit: mk };
}

function norm(v, fn) {
  if (v == null || v === "") return null;
  const n = fn ? fn(v) : v;
  return n === "" || n === null ? null : n;
}

async function main() {
  console.log("=== 国内站→海外站 同步开始 ===\n");

  const rate = await fetchExchangeRate();
  console.log(`汇率: 1 USD = ${rate.toFixed(2)} CNY`);

  // 连接国内站 DB
  console.log("连接国内站数据库...");
  const sql = neon(CLEAN_DB_URL);

  const rows = await sql`
    SELECT v.*,
      COALESCE(
        (SELECT json_agg(json_build_object('url', vi.url))
         FROM "VehicleImage" vi WHERE vi."vehicleId" = v.id),
        '[]'::json
      ) AS images
    FROM "Vehicle" v
    WHERE v.status IN ('APPROVED', 'PUBLISHED')
    ORDER BY v."createdAt" DESC
  `;

  console.log(`读取到 ${rows.length} 台可同步车辆\n`);

  if (rows.length === 0) {
    console.log("没有需要同步的车辆，退出");
    return;
  }

  // 转换
  const vehicles = rows.map((v) => {
    let type = "Used Passenger Car";
    if (v.equipmenttype) type = "Construction Machinery";
    else if (v.motorcycletype) type = "Motorcycle";
    else if (v.partcategory) type = "Auto Parts";
    else if (v.loadcapacitytons) type = "Truck";
    else if (v.batterytype) type = "New Energy Vehicle";

    const priceRmb = norm(v.price, Number) || 0;
    const originalRmbPrice = v.currency === "USD" ? priceRmb * rate : priceRmb;

    const descParts = [];
    if (v.description) descParts.push(v.description);
    if (v.repairrecords) descParts.push(`Maintenance: ${v.repairrecords}`);
    if (v.locationcity) descParts.push(`Location: ${v.locationcity}${v.locationprovince ? `, ${v.locationprovince}` : ""}`);
    if (v.exportport) descParts.push(`Port: ${v.exportport}`);

    let images = [];
    try {
      const raw = typeof v.images === "string" ? JSON.parse(v.images) : v.images;
      if (Array.isArray(raw)) images = raw.map((i) => (typeof i === "string" ? i : i?.url)).filter(Boolean);
    } catch {}

    return {
      sourceId: v.id,
      sourceSite: "domestic",
      brand: String(v.brand || ""),
      model: String(v.model || ""),
      year: norm(v.year, Number) || new Date().getFullYear(),
      type,
      mileage: norm(v.mileagekm, Number),
      transmission: norm(v.transmission),
      fuel: norm(v.fueltype),
      steering: norm(v.steering),
      exteriorColor: norm(v.exteriorcolor),
      interiorColor: norm(v.interiorcolor),
      condition: norm(v.condition) || "Excellent",
      series: norm(v.series),
      bodyStyle: norm(v.bodystyle),
      originalRmbPrice,
      images,
      description: descParts.join("\n") || null,
      batteryType: norm(v.batterytype),
      rangeKm: norm(v.rangekm, Number),
      motorPowerKw: norm(v.motorkw, Number),
      loadCapacityTons: norm(v.loadcapacitytons, Number),
      seatCount: norm(v.seatcount, Number),
      vehicleLengthM: norm(v.vehiclelengthm, Number),
      equipmentType: norm(v.equipmenttype),
      workingHours: norm(v.workinghours, Number),
      tonnage: norm(v.tonnage, Number),
      engineModel: norm(v.enginemodel),
      displacementCc: norm(v.displacementcc, Number),
      motorcycleType: norm(v.motorcycletype),
      partCategory: norm(v.partcategory),
      partCondition: norm(v.partcondition),
      compatibleModels: norm(v.compatiblemodels),
      quantity: norm(v.quantity, Number),
      displacement: norm(v.displacement, Number),
    };
  });

  // 分批发送
  const BATCH = 20;
  let ok = 0, fail = 0;
  const batches = Math.ceil(vehicles.length / BATCH);

  for (let i = 0; i < vehicles.length; i += BATCH) {
    const batch = vehicles.slice(i, i + BATCH);
    console.log(`[${Math.floor(i / BATCH) + 1}/${batches}] 发送 ${batch.length} 条...`);

    const res = await fetch(OVERSEAS_API + (OVERSEAS_API.includes("?") ? "&" : "?") + "_t=" + Date.now(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ADMIN_TOKEN },
      body: JSON.stringify({ vehicles: batch, exchangeRate: rate }),
    });

    const result = await res.json();

    if (res.ok) {
      ok += result.success || 0;
      fail += result.failed || 0;
      console.log(`   ✅ 成功:${result.success} 失败:${result.failed}`);
      if (result.failed > 0) {
        for (const r of (result.results || []).filter((rr) => !rr.success)) {
          console.log(`   ❌ ${r.brand} ${r.model}: ${r.error}`);
        }
      }
    } else {
      fail += batch.length;
      console.error(`   ❌ API 错误: ${result.error || res.status}`);
    }
  }

  // 日志
  try {
    mkdirSync(resolve(__dirname, "../state"), { recursive: true });
    writeFileSync(
      resolve(__dirname, "../state", "sync-log.jsonl"),
      JSON.stringify({ ts: new Date().toISOString(), total: vehicles.length, ok, fail, rate }) + "\n",
      { flag: "a" }
    );
  } catch {}

  console.log(`\n=== 完成 ===`);
  console.log(`总计:${vehicles.length}  成功:${ok}  失败:${fail}  汇率:${rate.toFixed(2)}`);
}

main().catch((e) => {
  console.error("❌ 异常:", e.message);
  process.exit(1);
});
