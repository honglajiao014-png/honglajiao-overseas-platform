// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcPrice } from "@/lib/pricing";
import { matchSpecsFromDb } from "@/lib/specMatcher";
import { requireAdmin } from "@/lib/adminAuth";

// ─── 国内站 VehicleStatus 映射 ───
const SYNCABLE_STATUSES = ["APPROVED", "PUBLISHED"];

interface SyncVehicleInput {
  // 核心字段
  brand: string;
  model: string;
  year: number;
  type: string;
  // 车况
  mileage?: number | null;
  transmission?: string | null;
  fuel?: string | null;
  fuelType?: string | null;
  steering?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  condition?: string | null;
  // 价格（RMB原始价格）
  originalRmbPrice: number;
  // 图片
  images: string[];
  // 描述/车况
  description?: string | null;
  // 车系
  series?: string | null;
  bodyStyle?: string | null;
  // 品类扩展
  batteryType?: string | null;
  rangeKm?: number | null;
  motorPowerKw?: number | null;
  loadCapacityTons?: number | null;
  seatCount?: number | null;
  vehicleLengthM?: number | null;
  equipmentType?: string | null;
  workingHours?: number | null;
  tonnage?: number | null;
  engineModel?: string | null;
  displacementCc?: number | null;
  motorcycleType?: string | null;
  partCategory?: string | null;
  partCondition?: string | null;
  compatibleModels?: string | null;
  quantity?: number | null;
  displacement?: number | null;
  engineNo?: string | null;
  keyCount?: number | null;
  // 源数据
  sourceId?: string | null;
  sourceSite?: string | null;
  specsJson?: string | null;
  specId?: string | null;
  specConflict?: boolean;
  soldAt?: string | null;
  // 汇率（可选，默认6.8）
  exchangeRate?: number;
}

export async function POST(req: NextRequest) {
  // 允许 API Key 认证（内部同步用）
  const apiKey = req.headers.get("x-api-key");
  if (apiKey && apiKey === process.env.SYNC_API_KEY) {
    // API key auth OK, skip admin check
  } else {
    const payload = requireAdmin(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await req.json();
  const vehicles: SyncVehicleInput[] = body.vehicles || [];
  const rate = body.exchangeRate || 6.8;

  if (vehicles.length === 0) {
    return NextResponse.json({ error: "No vehicles provided — use POST with vehicles[] array" }, { status: 400 });
  }

  const results: { success: boolean; slug?: string; brand?: string; model?: string; error?: string }[] = [];

  for (const v of vehicles) {
    try {
      // 1. 价格转换
      const basePriceUSD = Math.round((v.originalRmbPrice || 0) / rate);
      const pricing = calcPrice(basePriceUSD);

      // 1.5 规格匹配（国内站已有 specId 则跳过）
      let specId: string | null = v.specId || null;
      let specsJson: string | null = v.specsJson || null;
      let specConflict: boolean = v.specConflict || false;
      if (!specId) {
        const specMatch = await matchSpecsFromDb(v.brand, v.model);
        if (specMatch) {
          specId = specMatch.specId;
          specsJson = specMatch.specsJson;
          specConflict = false; // DB 匹配无冲突概念
          console.log(`[Sync] 规格匹配成功: ${v.brand} ${v.model} → specId=${specMatch.specId}`);
        } else {
          console.log(`[Sync] 规格未匹配: ${v.brand} ${v.model}`);
        }
      } else {
        console.log(`[Sync] 规格已存在跳过匹配: ${v.brand} ${v.model} specId=${specId}`);
      }

      // 2. 生成 slug（中文转拼音近似）
      const slugBrand = v.brand
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
        .replace(/中国/g, "china")
        .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
      const slugModel = v.model
        .replace(/[^a-zA-Z0-9一-鿿]+/g, "-").replace(/^-|-$/g, "")
        .substring(0, 30);
      const slug = [slugBrand, slugModel, v.year, Math.random().toString(36).slice(2, 6)]
        .filter(Boolean).join("-").toLowerCase();

      // 3. 检查是否已同步（sourceId 判重）
      if (v.sourceId) {
        const existing = await prisma.vehicle.findFirst({ where: { sourceId: v.sourceId } });
        if (existing) {
          // 已标记删除的车辆跳过，不更新（防止手动删除后被 sync 复活）
          if (existing.deleted) {
            console.log(`[Sync] 跳过已删除: ${v.sourceId} (slug=${existing.slug})`);
            results.push({ success: true, slug: existing.slug, brand: v.brand, model: v.model });
            continue;
          }
          // 更新已有车辆
          const soldAtDate = v.soldAt ? new Date(v.soldAt) : null;
          await prisma.vehicle.update({
            where: { id: existing.id },
            data: {
              brand: v.brand,
              model: v.model,
              year: v.year,
              type: v.type || "Used Passenger Car",
              mileage: v.mileage || null,
              transmission: v.transmission || null,
              fuel: v.fuel || null,
              fuelType: v.fuel || null,
              steering: v.steering || null,
              exteriorColor: v.exteriorColor || null,
              interiorColor: v.interiorColor || null,
              condition: v.condition || "Excellent",
              images: v.images || [],
              basePrice: pricing.basePrice,
              markup: pricing.markup,
              salePrice: pricing.salePrice,
              profit: pricing.profit,
              series: v.series || null,
              bodyStyle: v.bodyStyle || null,
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
              engineNo: v.engineNo || null,
              keyCount: v.keyCount || null,
              specId: specId,
              specsJson: specsJson,
              specConflict: specConflict,
              soldAt: soldAtDate,
              originalPrice: v.originalRmbPrice || 0,
              description: v.description || null,
              published: !soldAtDate,
            },
          });
          results.push({ success: true, slug, brand: v.brand, model: v.model });
          continue;
        }
      }

      // 4. 新建
      const soldAtDate = v.soldAt ? new Date(v.soldAt) : null;
      await prisma.vehicle.create({
        data: {
          id: `v-sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          slug,
          brand: v.brand,
          model: v.model,
          year: v.year,
          type: v.type || "Used Passenger Car",
          mileage: v.mileage || null,
          transmission: v.transmission || null,
          fuel: v.fuel || null,
          fuelType: v.fuel || null,
          steering: v.steering || null,
          exteriorColor: v.exteriorColor || null,
          interiorColor: v.interiorColor || null,
          condition: v.condition || "Excellent",
          images: v.images || [],
          basePrice: pricing.basePrice,
          markup: pricing.markup,
          salePrice: pricing.salePrice,
          profit: pricing.profit,
          series: v.series || null,
          bodyStyle: v.bodyStyle || null,
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
          engineNo: v.engineNo || null,
          keyCount: v.keyCount || null,
          specId: specId,
          specsJson: specsJson,
          specConflict: specConflict,
          soldAt: soldAtDate,
          originalPrice: v.originalRmbPrice || 0,
          description: v.description || null,
          sourceId: v.sourceId || null,
          sourceSite: v.sourceSite || "domestic",
          published: !soldAtDate,
          updatedAt: new Date(),
        },
      });
      results.push({ success: true, slug, brand: v.brand, model: v.model });
    } catch (e: any) {
      results.push({ success: false, brand: v.brand, model: v.model, error: e.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    total: vehicles.length,
    success: successCount,
    failed: failCount,
    results,
  });
}
