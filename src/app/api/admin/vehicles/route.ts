import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

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
    orderBy: { createdAt: "desc" },
    include: { dealer: { select: { name: true, company: true } } },
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

  const slug = `${data.brand}-${data.model}-${data.year}-${Date.now()}`.toLowerCase().replace(/\s+/g, "-");

  const vehicle = await prisma.vehicle.create({
    data: {
      slug,
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      type: data.type || "Used Passenger Car",
      mileage: data.mileage ? Number(data.mileage) : null,
      transmission: data.transmission || "Automatic",
      fuel: data.fuel || "Petrol",
      steering: data.steering || "LHD",
      color: data.color,
      supplier: data.supplier,
      location: data.location || "China",
      images,
      basePrice: Number(data.basePrice) || 0,
      markup: Number(data.markup) || 0,
      salePrice: (Number(data.basePrice) || 0) + (Number(data.markup) || 0),
      profit: Number(data.markup) || 0,
      description: data.description,
      published: data.published !== false,
      featured: data.featured || false,
      dealerId: data.dealerId || null,
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

  if (data.basePrice !== undefined || data.markup !== undefined) {
    const current = await prisma.vehicle.findUnique({ where: { id } });
    if (current) {
      const basePrice = data.basePrice !== undefined ? Number(data.basePrice) : current.basePrice;
      const markup = data.markup !== undefined ? Number(data.markup) : current.markup;
      update.basePrice = basePrice;
      update.markup = markup;
      update.salePrice = basePrice + markup;
      update.profit = markup;
    }
  }
  const vehicle = await prisma.vehicle.update({ where: { id }, data: update });
  return NextResponse.json({ vehicle });
}

// 删除车辆
export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
