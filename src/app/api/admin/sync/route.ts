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
  let vehicles: SyncVehicleInput[] = body.vehicles || [];
  const rate = body.exchangeRate || 6.8;

  // 如果没有传入 vehicles，尝试从国内站 DB 自动读取
  if (vehicles.length === 0 && process.env.DOMESTIC_DB_URL) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const cleanUrl = process.env.DOMESTIC_DB_URL.replace(/^"|"$/g, "").replace(
        /[?&]channel_binding=require/g, ""
      );
      const sql = neon(cleanUrl);
      const QUERY = "SELECT v.*, COALESCE(" +
        "(SELECT json_agg(json_build_object('url', vi.url)) " +
        "FROM \"VehicleImage\" vi WHERE vi.\"vehicleId\" = v.id), " +
        "'[]'::json) AS images " +
        "FROM \"Vehicle\" v " +
        "WHERE v.status IN ('APPROVED', 'PUBLISHED') " +
        "ORDER BY v.\"createdAt\" DESC";
      const rows = await sql.query(QUERY);

      vehicles = rows.map((v: any) => ({
        sourceId: v.id,
        sourceSite: "domestic",
        brand: String(v.brand || ""),
        model: String(v.model || ""),
        year: parseInt(v.year) || new Date().getFullYear(),
        type: v.equipmenttype ? "Construction Machinery" :
              v.motorcycletype ? "Motorcycle" :
              v.partcategory ? "Auto Parts" :
              v.loadcapacitytons ? "Truck" :
              v.batterytype ? "New Energy Vehicle" : "Used Passenger Car",
        mileage: v.mileagekm ? parseInt(v.mileagekm) : null,
        transmission: v.transmission || null,
        fuel: v.fueltype || null,
        steering: v.steering || null,
        exteriorColor: v.exteriorcolor || null,
        interiorColor: v.interiorcolor || null,
        condition: v.condition || "Excellent",
        series: v.series || null,
        bodyStyle: v.bodystyle || null,
        originalRmbPrice: parseFloat(v.price) || 0,
        images: (() => {
          try {
            const raw = typeof v.images === "string" ? JSON.parse(v.images) : v.images;
            return (Array.isArray(raw) ? raw : []).map((i: any) => typeof i === "string" ? i : i?.url).filter(Boolean);
          } catch { return []; }
        })(),
        description: [v.description, v.repairrecords ? "Maintenance: " + v.repairrecords : ""].filter(Boolean).join("\n") || null,
      }));
      console.log("[Sync] Auto-read " + vehicles.length + " vehicles from domestic DB");
    } catch (e: any) {
      return NextResponse.json({ error: "Failed to read domestic DB: " + e.message }, { status: 500 });
    }
  }

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
