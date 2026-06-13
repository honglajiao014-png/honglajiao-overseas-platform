// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { calcPrice } from "@/lib/pricing";
import { matchSpecsFromDb } from "@/lib/specMatcher";

/** 校验 Blob URL 格式 */
function isValidBlobUrl(url: string): boolean {
  if (!url) return false;
  if (!url.startsWith("https://") && !url.startsWith("http://")) return false;
  const isBlobUrl =
    url.includes(".blob.vercel-storage.com") ||
    url.includes(".public.blob.vercel-storage.com");
  if (!isBlobUrl) {
    console.warn("[admin/vehicles] 非 Blob URL:", url.substring(0, 80));
  }
  return isBlobUrl;
}

// 获取所有车辆(含底价和利润)
export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const vehicles = await prisma.vehicle.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ vehicles });
}

// 新增车辆
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Content-Length 预警
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 4_000_000) {
    console.warn(`[admin/vehicles] 请求体过大: ${(parseInt(contentLength) / 1_000_000).toFixed(1)}MB`);
  }

  const data = await req.json();
  console.log(`[admin/vehicles] brand=${data.brand} model=${data.model} images=${data.images?.length} bodySize=${JSON.stringify(data).length}字节`);

  // 校验 images URL 格式
  const images: string[] = data.images || [];
  for (let i = 0; i < images.length; i++) {
    if (!isValidBlobUrl(images[i])) {
      console.error(`[admin/vehicles] 第${i + 1}张图片 URL 无效:`, images[i]?.substring(0, 100));
      return NextResponse.json({ error: `第${i + 1}张图片 URL 格式异常，请通过 /api/upload 重新上传` }, { status: 400 });
    }
  }

  // 去重：检查是否已存在相同 brand + model + year 且未删除的车辆
  const existing = await prisma.vehicle.findFirst({
    where: {
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      deleted: false,
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: `车辆已存���: ${data.brand} ${data.model} (${data.year})，请通过编辑更新而非重复添加`, existingId: existing.id },
      { status: 409 }
    );
  }

  const slug = `${data.brand}-${data.model}-${data.year}-${Date.now()}`.toLowerCase().replace(/\s+/g, "-");

  // 自动匹配 VehicleSpec 规格
  let specId: string | null = null;
  let specsJson: string | null = null;
  try {
    const specMatch = await matchSpecsFromDb(data.brand, data.model);
    if (specMatch) {
      specId = specMatch.specId;
      specsJson = specMatch.specsJson;
      console.log(`[admin/vehicles] 规格匹配成功: ${data.brand} ${data.model} → specId=${specId}`);
    } else {
      console.log(`[admin/vehicles] 未找到匹配规格: ${data.brand} ${data.model}`);
    }
  } catch (e) {
    console.warn(`[admin/vehicles] 规格匹配异常:`, e);
  }

  // 构建扩展字段（来自自动填充）
  const extendedFields: Record<string, any> = {};
  const numericFields = ["displacement", "displacementCc", "seatCount", "motorPowerKw", "vehicleLengthM", "rangeKm", "keyCount", "quantity", "loadCapacityTons", "tonnage", "workingHours", "originalPrice"];
  const stringFields = ["engineModel", "bodyStyle", "fuelType", "series", "batteryType", "engineNo", "equipmentType", "exteriorColor", "interiorColor", "motorcycleType", "partCategory", "partCondition", "sourceId", "sourceSite", "compatibleModels"];

  for (const field of numericFields) {
    if (data[field] !== undefined && data[field] !== null) {
      extendedFields[field] = Number(data[field]);
    }
  }
  for (const field of stringFields) {
    if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
      extendedFields[field] = data[field];
    }
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      slug,
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      type: data.type || "Used Passenger Car",
      mileageKm: data.mileageKm ? Number(data.mileageKm) : null,
      transmission: data.transmission || "Automatic",
      fuelType: data.fuelType || "Petrol",
      steering: data.steering || "LHD",
      color: data.color,
      supplier: data.supplier,
      location: data.location || "China",
      images,
      ...(() => {
        const p = calcPrice(Number(data.basePrice) || 0);
        return { basePrice: p.basePrice, markup: p.markup, salePrice: p.salePrice, profit: p.profit };
      })(),
      description: data.description,
      published: data.published !== false,
      featured: data.featured || false,
      dealerId: data.dealerId || null,
      specId,
      specsJson,
      ...extendedFields,
    },
  });

  const elapsed = Date.now() - startTime;
  console.log(`[admin/vehicles] 创建成功 id=${vehicle.id} images=${images.length} elapsed=${elapsed}ms`);
  return NextResponse.json({ vehicle });
}

// 更新车辆
export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  const update: any = { ...data };

  // 校验 images URL（如果有）
  if (update.images && Array.isArray(update.images)) {
    for (let i = 0; i < update.images.length; i++) {
      if (!isValidBlobUrl(update.images[i])) {
        return NextResponse.json({ error: `第${i + 1}张图片 URL 格式异常` }, { status: 400 });
      }
    }
  }

  if (data.basePrice !== undefined) {
    const p = calcPrice(Number(data.basePrice) || 0);
    update.basePrice = p.basePrice;
    update.markup = p.markup;
    update.salePrice = p.salePrice;
    update.profit = p.profit;
  }

  // 如果 brand 或 model 变更，重新匹配规格
  if (data.brand || data.model) {
    try {
      const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { brand: true, model: true } });
      const brand = data.brand || vehicle?.brand || "";
      const model = data.model || vehicle?.model || "";
      const specMatch = await matchSpecsFromDb(brand, model);
      if (specMatch) {
        update.specId = specMatch.specId;
        update.specsJson = specMatch.specsJson;
        console.log(`[admin/vehicles] PATCH 规格重新匹配: ${brand} ${model} → specId=${specMatch.specId}`);
      }
    } catch (e) {
      console.warn(`[admin/vehicles] PATCH 规格匹配异常:`, e);
    }
  }

  const vehicle = await prisma.vehicle.update({ where: { id }, data: update });
  return NextResponse.json({ vehicle });
}

// 软删除车辆（标记删除，不真删数据，防止 sync 复活）
export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "缺少车辆ID" }, { status: 400 });
  }

  // 先检查车辆是否存在
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    return NextResponse.json({ error: "车辆不存在" }, { status: 404 });
  }

  // 级联删除关联的询价和订单（这些是真删）
  const deletedInquiries = await prisma.inquiry.deleteMany({ where: { vehicleId: id } });
  const deletedOrders = await prisma.order.deleteMany({ where: { vehicleId: id } });

  // 软删除：标记 deleted=true + 下架
  await prisma.vehicle.update({
    where: { id },
    data: { deleted: true, published: false },
  });

  console.log(`[admin/vehicles] 软删除车辆 ${vehicle.brand} ${vehicle.model} (${vehicle.year})，级联删除 ${deletedInquiries.count} 条询价、${deletedOrders.count} 条订单`);

  return NextResponse.json({
    success: true,
    detail: {
      vehicle: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
      deletedInquiries: deletedInquiries.count,
      deletedOrders: deletedOrders.count,
      message: "已标记删除，sync 不会再复活此车辆",
    },
  });
}
