/**
 * 国内站 → 海外站 同步脚本
 *
 * 用法:
 *   cd /Users/mj/honglajiao-overseas-platform
 *   npx tsx scripts/sync-domestic.ts
 *
 * 流程:
 *   1. 直连国内站 Neon DB
 *   2. 读取 status=APPROVED 或 PUBLISHED 的车辆
 *   3. 按品类映射字段
 *   4. 计算价格 (RMB→USD, 阶梯加价)
 *   5. 尝试匹配 xlsx 规格
 *   6. POST 到海外站 /api/admin/sync
 */

import { neon } from "@neondatabase/serverless";

// ─── 配置 ───
const DOMESTIC_DB_URL = process.env.HLJ9588_DATABASE_URL || "postgresql://neondb_owner:npg_yhW7txZvOci2@ep-jolly-math-aqpdg00m-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const OVERSEAS_API = process.env.OVERSEAS_API_URL || "http://localhost:3000/api/admin/sync";
const ADMIN_TOKEN = process.env.SYNC_API_KEY || "";
const SYNC_API_URL = OVERSEAS_API;
const EXCHANGE_RATE = 6.8; // 固定汇率，实时可通过 API 获取

// ─── 国内站品类枚举映射 ───
const CATEGORY_MAP: Record<string, string> = {
  SEDAN: "Sedan",
  SUV: "SUV",
  MPV: "MPV",
  HATCHBACK: "Hatchback",
  WAGON: "Wagon",
  COUPE: "Coupe",
  PICKUP: "Pickup Truck",
};

async function fetchExchangeRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/CNY");
    const data = await res.json() as any;
    if (data.result === "success" && data.rates?.USD) {
      return 1 / data.rates.USD; // 1 USD = ? CNY
    }
  } catch { /* fallback */ }
  return 6.8;
}

interface DomesticVehicle {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  manufactureDate: Date | null;
  registrationDate: Date | null;
  mileageKm: number | null;
  fuelType: string | null;
  displacement: number | null;
  transmission: string | null;
  steering: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  condition: string | null;
  price: number;
  currency: string;
  series: string | null;
  bodyStyle: string | null;
  description: string | null;
  // Category-specific
  batteryType: string | null;
  rangeKm: number | null;
  motorPowerKw: number | null;
  loadCapacityTons: number | null;
  seatCount: number | null;
  vehicleLengthM: number | null;
  equipmentType: string | null;
  workingHours: number | null;
  tonnage: number | null;
  engineModel: string | null;
  displacementCc: number | null;
  motorcycleType: string | null;
  partCategory: string | null;
  partCondition: string | null;
  compatibleModels: string | null;
  quantity: number | null;
  // Images
  images: { url: string }[];
  locationCity: string | null;
  locationProvince: string | null;
  exportPort: string | null;
  repairRecords: string | null;
  status: string;
}

async function main() {
  console.log("=== 国内站→海外站 同步开始 ===");
  console.log(`汇率获取中...`);
  const rate = await fetchExchangeRate();
  console.log(`当前汇率: 1 USD = ${rate.toFixed(2)} CNY`);

  // 1. 读取国内站车辆
  console.log("\n连接国内站数据库...");
  const sql = neon(DOMESTIC_DB_URL);

  const rows = await sql`
    SELECT v.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object('url', vi.url)) FILTER (WHERE vi.id IS NOT NULL), '[]') as images
    FROM "Vehicle" v
    LEFT JOIN "VehicleImage" vi ON vi."vehicleId" = v.id
    WHERE v.status IN ('APPROVED', 'PUBLISHED')
    GROUP BY v.id
    ORDER BY v."createdAt" DESC
  `;

  console.log(`读取到 ${rows.length} 台可同步车辆`);

  if (rows.length === 0) {
    console.log("没有需要同步的车辆，退出");
    return;
  }

  // 2. 转换数据
  const vehicles = rows.map((v: any) => {
    // 判断品类
    let type = "Used Passenger Car";
    if (v.equipmentType) type = "Construction Machinery";
    else if (v.motorcycleType) type = "Motorcycle";
    else if (v.partCategory) type = "Auto Parts";
    else if (v.loadCapacityTons) type = "Truck";
    else if (v.batteryType) type = "New Energy Vehicle";
    else if (v.bodyStyle === "SEDAN" || v.bodyStyle === "SUV" || v.bodyStyle === "MPV") type = "Used Passenger Car";

    // 价格转换 (RMB → USD)
    const priceRmb = v.price || 0;
    // 如果国内存的是 USD，就不转换
    const originalRmbPrice = v.currency === "USD" ? priceRmb * rate : priceRmb;

    // Build description
    const descParts: string[] = [];
    if (v.description) descParts.push(v.description);
    if (v.repairRecords) descParts.push(`\n维修记录: ${v.repairRecords}`);
    if (v.locationCity) descParts.push(`\n所在地: ${v.locationCity}${v.locationProvince ? `, ${v.locationProvince}` : ""}`);
    if (v.exportPort) descParts.push(`\n出口港: ${v.exportPort}`);
    if (v.manufactureDate) descParts.push(`\n出厂日期: ${v.manufactureDate.toISOString().slice(0, 10)}`);
    if (v.registrationDate) descParts.push(`\n发证日期: ${v.registrationDate.toISOString().slice(0, 10)}`);

    return {
      sourceId: v.id,
      sourceSite: "domestic",
      brand: v.brand,
      model: v.model,
      year: v.year || new Date().getFullYear(),
      type,
      mileage: v.mileageKm || null,
      transmission: v.transmission || null,
      fuel: v.fuelType || null,
      steering: v.steering || null,
      exteriorColor: v.exteriorColor || null,
      interiorColor: v.interiorColor || null,
      condition: v.condition || "Excellent",
      series: v.series || null,
      bodyStyle: v.bodyStyle || null,
      originalRmbPrice,
      images: (v.images || []).map((img: any) => img.url).filter(Boolean),
      description: descParts.join("\n") || null,
      // 品类扩展字段
      batteryType: v.batteryType || null,
      rangeKm: v.rangeKm || null,
      motorPowerKw: v.motorPowerKw || null,
      loadCapacityTons: v.loadCapacityTons || null,
      seatCount: v.seatCount || null,
      vehicleLengthM: v.vehicleLengthM || null,
      equipmentType: v.equipmentType || null,
      workingHours: v.workingHours || null,
      tonnage: v.tonnage || null,
      engineModel: v.engineModel || null,
      displacementCc: v.displacementCc || null,
      motorcycleType: v.motorcycleType || null,
      partCategory: v.partCategory || null,
      partCondition: v.partCondition || null,
      compatibleModels: v.compatibleModels || null,
      quantity: v.quantity || null,
      displacement: v.displacement || null,
    };
  });

  // 3. 批量发送
  console.log(`\n发送 ${vehicles.length} 条数据到海外站...`);

  const res = await fetch(OVERSEAS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ vehicles, exchangeRate: rate }),
  });

  const result = await res.json();

  if (res.ok) {
    console.log(`\n✅ 同步完成！`);
    console.log(`   总计: ${result.total}`);
    console.log(`   成功: ${result.success}`);
    console.log(`   失败: ${result.failed}`);
    if (result.failed > 0) {
      console.log(`\n失败详情:`);
      for (const r of result.results.filter((r: any) => !r.success)) {
        console.log(`   ❌ ${r.brand} ${r.model}: ${r.error}`);
      }
    }
  } else {
    console.error(`\n❌ 同步请求失败:`, result.error || res.statusText);
  }

  // 4. 写入同步日志
  console.log(`\n=== 同步结束 ===`);
  const elapsed = new Date().toISOString();
  console.log(`时间: ${elapsed}`);
}

main().catch(console.error);
