import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { calcPrice } from "@/lib/pricing";

// GET /api/admin/specs?brand=奥迪&model=Q3 — auto-match vehicle spec
export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  if (!brand || !model) return NextResponse.json({ error: "brand and model required" }, { status: 400 });

  // Try exact match first
  let spec = await prisma.vehicleSpec.findFirst({
    where: { brand, model },
  });

  // Try fuzzy match
  if (!spec) {
    spec = await prisma.vehicleSpec.findFirst({
      where: {
        brand: { contains: brand },
        model: { contains: model },
      },
    });
  }

  if (!spec) {
    return NextResponse.json({ error: "No spec found for this vehicle" }, { status: 404 });
  }

  return NextResponse.json({
    specId: spec.id,
    manufacturer: spec.manufacturer,
    energyType: spec.energyType,
    specs: JSON.parse(spec.specs),
  });
}

// POST — Admin uploads vehicle with auto-spec matching
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { brand, model, year, basePrice, markup, ...rest } = data;

  // Auto-match spec
  let specId: string | null = null;
  const spec = await prisma.vehicleSpec.findFirst({
    where: {
      brand: { contains: brand },
      model: { contains: model },
    },
  });
  if (spec) specId = spec.id;

  const slug = `${brand}-${model}-${year}-${Date.now()}`.toLowerCase().replace(/\s+/g, "-");
  const bp = Number(basePrice) || 0;
  const p = calcPrice(bp);

  const vehicle = await prisma.vehicle.create({
    data: {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug,
      brand,
      model,
      year: Number(year),
      type: rest.type || "Used Passenger Car",
      mileage: rest.mileage ? Number(rest.mileage) : null,
      transmission: rest.transmission || "Automatic",
      fuel: rest.fuel || "Petrol",
      steering: rest.steering || "LHD",
      color: rest.color || null,
      supplier: rest.supplier || null,
      location: rest.location || "China",
      images: rest.images || [],
      basePrice: p.basePrice,
      markup: p.markup,
      salePrice: p.salePrice,
      profit: p.profit,
      description: rest.description || null,
      published: true,
      featured: rest.featured || false,
      specId,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ vehicle, specMatched: !!specId });
}

// PATCH — 更新规格
export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "缺少规格ID" }, { status: 400 });

  // 校验 specs JSON
  if (data.specs && typeof data.specs === "string") {
    try { JSON.parse(data.specs); } catch {
      return NextResponse.json({ error: "specs 不是有效的 JSON" }, { status: 400 });
    }
  }

  const spec = await prisma.vehicleSpec.update({ where: { id }, data });
  return NextResponse.json({ spec });
}

// DELETE — 删除规格
export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "缺少规格ID" }, { status: 400 });

  // 先解除关联车辆的 specId
  await prisma.vehicle.updateMany({ where: { specId: id }, data: { specId: null } });
  await prisma.vehicleSpec.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
