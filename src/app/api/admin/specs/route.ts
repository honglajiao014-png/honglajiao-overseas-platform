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
    vehicleType: spec.vehicleType,
    releaseDate: spec.releaseDate,
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
    },
  });

  return NextResponse.json({ vehicle, specMatched: !!specId });
}
