import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

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

// 新增/更新车辆
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
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
      images: data.images || [],
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
  return NextResponse.json({ vehicle });
}

// 更新车辆
export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  const update: any = { ...data };
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
