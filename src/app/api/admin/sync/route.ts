import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcPrice } from "@/lib/pricing";
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
  // 源数据
  sourceId?: string | null;
  sourceSite?: string | null;
  specsJson?: string | null;
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
    return NextResponse.json({ error: "No vehicles provided" }, { status: 400 });
  }

  const results: { success: boolean; slug?: string; brand?: string; model?: string; error?: string }[] = [];

  for (const v of vehicles) {
    try {
      // 1. 价格转换
      const basePriceUSD = Math.round((v.originalRmbPrice || 0) / rate);
      const pricing = calcPrice(basePriceUSD);

      // 2. 生成 slug
      const slug = `${v.brand}-${v.model}-${v.year}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      // 3. 检查是否已同步（sourceId 判重）
      if (v.sourceId) {
        const existing = await prisma.vehicle.findFirst({ where: { sourceId: v.sourceId } });
        if (existing) {
          // 更新已有车辆
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
              specsJson: v.specsJson || null,
              originalPrice: v.originalRmbPrice || 0,
              description: v.description || null,
              published: true,
            },
          });
          results.push({ success: true, slug, brand: v.brand, model: v.model });
          continue;
        }
      }

      // 4. 新建
      await prisma.vehicle.create({
        data: {
          slug,
          brand: v.brand,
          model: v.model,
          year: v.year,
          type: v.type || "Used Passenger Car",
          mileage: v.mileage || null,
          transmission: v.transmission || null,
          fuel: v.fuel || null,
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
          specsJson: v.specsJson || null,
          originalPrice: v.originalRmbPrice || 0,
          description: v.description || null,
          sourceId: v.sourceId || null,
          sourceSite: v.sourceSite || "domestic",
          published: true,
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
