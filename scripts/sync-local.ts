// @ts-nocheck
/**
 * 国内站 → 海外站 同步脚本（本地 PG 版）
 *
 * 用法: DATABASE_URL=postgresql://mj@localhost:5432/hlj_overseas_dev npx tsx scripts/sync-local.ts
 *
 * 流程:
 *   1. 直连国内站 Neon DB (HTTP)
 *   2. 读取 status=APPROVED 或 PUBLISHED 的车辆
 *   3. 按品类映射字段
 *   4. 计算价格 (RMB→USD, 阶梯加价)
 *   5. 匹配本地规格库
 *   6. 写入本地海外站 PG
 */

import { neon } from "/Users/mj/honglingjing-auto-platform/node_modules/@neondatabase/serverless/index.js";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ─── 国内站 Neon 连接 ───
const DOMESTIC_DB_URL = "postgresql://neondb_owner:npg_yhW7txZvOci2@ep-jolly-math-aqpdg00m-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

// ─── 海外站本地 PG ───
const OVERSEAS_DB_URL = process.env.DATABASE_URL || "postgresql://mj@localhost:5432/hlj_overseas_dev";

const EXCHANGE_RATE = 6.8;

// ─── 品类枚举映射 ───
const BODY_STYLE_MAP: Record<string, string> = {
  SEDAN: "Sedan", SUV: "SUV", MPV: "MPV", HATCHBACK: "Hatchback",
  WAGON: "Wagon", COUPE: "Coupe", PICKUP: "Pickup Truck",
};

// ─── 价格计算 ───
function calcPrice(basePriceUSD: number) {
  const bp = Math.max(0, Number(basePriceUSD) || 0);
  let r = 0;
  if (bp <= 5000) r = 0.45;
  else if (bp <= 10000) r = 0.35;
  else if (bp <= 20000) r = 0.28;
  else if (bp <= 50000) r = 0.22;
  else if (bp <= 100000) r = 0.18;
  else r = 0.15;
  const markup = Math.round(bp * r);
  return { basePrice: bp, markup, salePrice: bp + markup, profit: markup };
}

// ─── 中文品牌→英文 slug ───
function brandToSlug(brand: string): string {
  return brand
    .replace(/奥迪/g, "audi").replace(/宝马/g, "bmw").replace(/奔驰/g, "mercedes")
    .replace(/大众/g, "volkswagen").replace(/丰田/g, "toyota").replace(/本田/g, "honda")
    .replace(/日产/g, "nissan").replace(/现代/g, "hyundai").replace(/起亚/g, "kia")
    .replace(/福特/g, "ford").replace(/别克/g, "buick").replace(/雪佛兰/g, "chevrolet")
    .replace(/标致/g, "peugeot").replace(/雪铁龙/g, "citroen").replace(/马自达/g, "mazda")
    .replace(/三菱/g, "mitsubishi").replace(/沃尔沃/g, "volvo").replace(/路虎/g, "landrover")
    .replace(/捷豹/g, "jaguar").replace(/保时捷/g, "porsche").replace(/法拉利/g, "ferrari")
    .replace(/兰博基尼/g, "lamborghini").replace(/比亚迪/g, "byd").replace(/长城/g, "greatwall")
    .replace(/吉利/g, "geely").replace(/长安/g, "changan").replace(/奇瑞/g, "cherry")
    .replace(/江淮/g, "jac").replace(/福田/g, "foton").replace(/东风/g, "dongfeng")
    .replace(/中国/g, "china").replace(/哈弗/g, "haval").replace(/五菱/g, "wuling")
    .replace(/传祺/g, "trumpchi").replace(/荣威/g, "roewe").replace(/名爵/g, "mg")
    .replace(/领克/g, "lynkco").replace(/蔚来/g, "nio").replace(/理想/g, "lixiang")
    .replace(/小鹏/g, "xpeng").replace(/红旗/g, "hongqi")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getOrCreateSystemUser(prisma: any) {
  let user = await prisma.user.findFirst({ where: { role: "SYSTEM" } });
  if (!user) {
    user = await prisma.user.create({
      data: { username: "system-publish", role: "SYSTEM", status: "ACTIVE" },
    });
  }
  return user.id;
}

async function main() {
  console.log("=== 国内站→海外站 同步（本地 PG 版） ===\n");

  // 1. 连接国内站 Neon
  console.log("🔌 连接国内站 Neon...");
  const sql = neon(DOMESTIC_DB_URL);

  const rows = await sql`
    SELECT v.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', vi.id, 'url', vi.url, 'angleType', vi."angleType", 'isPrimary', vi."isPrimary"
      )) FILTER (WHERE vi.id IS NOT NULL), '[]') as images_json
    FROM "Vehicle" v
    LEFT JOIN "VehicleImage" vi ON vi."vehicleId" = v.id
    WHERE v.status IN ('APPROVED', 'PUBLISHED')
    GROUP BY v.id
    ORDER BY v."createdAt" DESC
  `;

  console.log(`📊 国内站可同步车辆: ${rows.length} 台`);

  if (rows.length === 0) {
    console.log("没有需要同步的车辆，退出");
    return;
  }

  // 2. 连接海外站本地 PG
  console.log("🔌 连接海外站本地 PG...");
  const adapter = new PrismaPg({ connectionString: OVERSEAS_DB_URL });
  const prisma = new PrismaClient({ adapter }) as any;

  const systemUserId = await getOrCreateSystemUser(prisma);

  // 3. 逐台处理
  let created = 0, updated = 0, skipped = 0;
  const results: any[] = [];

  for (const v of rows) {
    try {
      // 判断品类类型
      let type = "Used Passenger Car";
      if (v.equipmenttype) type = "Construction Machinery";
      else if (v.motorcycletype) type = "Motorcycle";
      else if (v.partcategory) type = "Auto Parts";
      else if (v.loadcapacitytons) type = "Truck";
      else if (v.batterytype) type = "New Energy Vehicle";

      // 价格转换 (RMB → USD)
      const priceRmb = v.price || 0;
      const originalRmbPrice = v.currency === "USD" ? priceRmb * EXCHANGE_RATE : priceRmb;
      const basePriceUSD = Math.round(originalRmbPrice / EXCHANGE_RATE);
      const pricing = calcPrice(basePriceUSD);

      // 生成 slug
      const slugBrand = brandToSlug(v.brand || "");
      const slugModel = String(v.model || "")
        .replace(/[^a-zA-Z0-9一-鿿]+/g, "-").replace(/^-|-$/g, "")
        .substring(0, 30);
      const slug = [slugBrand, slugModel, v.year, Math.random().toString(36).slice(2, 6)]
        .filter(Boolean).join("-").toLowerCase();

      // 图片 URL 列表
      let imageUrls: string[] = [];
      try {
        const imgs = typeof v.images_json === "string" ? JSON.parse(v.images_json) : (v.images_json || []);
        if (Array.isArray(imgs)) imageUrls = imgs.map((i: any) => i.url || i).filter(Boolean);
      } catch { imageUrls = []; }

      // 描述构建
      const descParts: string[] = [];
      if (v.condition) descParts.push(`Condition: ${v.condition}`);
      if (v.repairrecords) descParts.push(`Maintenance: ${v.repairrecords}`);
      if (v.locationcity) descParts.push(`Location: ${v.locationcity}${v.locationprovince ? `, ${v.locationprovince}` : ""}`);
      if (v.exportport) descParts.push(`Port: ${v.exportport}`);
      if (v.manufacturedate) descParts.push(`Manufacture Date: ${new Date(v.manufacturedate).toISOString().slice(0, 10)}`);
      if (v.registrationdate) descParts.push(`Registration Date: ${new Date(v.registrationdate).toISOString().slice(0, 10)}`);
      const description = descParts.join("\n") || null;

      // sourceId 判重
      const existing = await prisma.vehicle.findFirst({ where: { sourceId: v.id } });

      if (existing) {
        if (existing.deleted) {
          console.log(`⏭️  跳过已删除: ${v.brand} ${v.model} (slug=${existing.slug})`);
          skipped++;
          results.push({ success: true, slug: existing.slug, brand: v.brand, model: v.model, skipped: true });
          continue;
        }

        // 更新已有车辆
        await prisma.vehicle.update({
          where: { id: existing.id },
          data: {
            brand: v.brand,
            model: v.model,
            year: v.year,
            type,
            mileageKm: v.mileagekm || null,
            transmission: v.transmission || null,
            fuelType: v.fueltype || null,
            steering: v.steering || "LHD",
            exteriorColor: v.exteriorcolor || null,
            interiorColor: v.interiorcolor || null,
            condition: v.condition || "Excellent",
            price: pricing.salePrice,
            basePrice: pricing.basePrice,
            markup: pricing.markup,
            salePrice: pricing.salePrice,
            profit: pricing.profit,
            series: v.series || null,
            bodyStyle: v.bodystyle || null,
            displacement: v.displacement || null,
            originalPrice: originalRmbPrice,
            description,
            sourceId: v.id,
            sourceSite: "domestic",
            published: true,
            updatedAt: new Date(),
          },
        });

        // 更新图片
        if (imageUrls.length > 0) {
          await prisma.vehicleImage.deleteMany({ where: { vehicleId: existing.id } });
          for (let i = 0; i < imageUrls.length; i++) {
            await prisma.vehicleImage.create({
              data: {
                vehicleId: existing.id,
                angleType: "FRONT",
                url: imageUrls[i],
                isPrimary: i === 0,
                sortOrder: i,
              },
            });
          }
        }

        console.log(`✅ 更新: ${v.brand} ${v.model} slug=${existing.slug} salePrice=$${pricing.salePrice}`);
        updated++;
        results.push({ success: true, slug: existing.slug, brand: v.brand, model: v.model });
      } else {
        // 新建车辆
        const vehicleId = `v-sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await prisma.vehicle.create({
          data: {
            id: vehicleId,
            slug,
            dealerId: systemUserId,
            brand: v.brand,
            model: v.model,
            year: v.year || new Date().getFullYear(),
            type,
            mileageKm: v.mileagekm || null,
            transmission: v.transmission || null,
            fuelType: v.fueltype || null,
            steering: v.steering || "LHD",
            exteriorColor: v.exteriorcolor || null,
            interiorColor: v.interiorcolor || null,
            condition: v.condition || "Excellent",
            price: pricing.salePrice,
            basePrice: pricing.basePrice,
            markup: pricing.markup,
            salePrice: pricing.salePrice,
            profit: pricing.profit,
            series: v.series || null,
            bodyStyle: v.bodystyle || null,
            displacement: v.displacement || null,
            originalPrice: originalRmbPrice,
            description,
            sourceId: v.id,
            sourceSite: "domestic",
            published: true,
          },
        });

        // 创建图片
        if (imageUrls.length > 0) {
          for (let i = 0; i < imageUrls.length; i++) {
            await prisma.vehicleImage.create({
              data: {
                vehicleId,
                angleType: "FRONT",
                url: imageUrls[i],
                isPrimary: i === 0,
                sortOrder: i,
              },
            });
          }
        }

        console.log(`✅ 新建: ${v.brand} ${v.model} slug=${slug} salePrice=$${pricing.salePrice}`);
        created++;
        results.push({ success: true, slug, brand: v.brand, model: v.model });
      }
    } catch (e: any) {
      console.error(`❌ 失败: ${v.brand} ${v.model}: ${e.message}`);
      results.push({ success: false, brand: v.brand, model: v.model, error: e.message });
    }
  }

  console.log(`\n=== 同步完成 ===`);
  console.log(`总计: ${rows.length}  新建: ${created}  更新: ${updated}  跳过: ${skipped}  失败: ${results.filter(r => !r.success).length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
