// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slug = "peugeot-408-2020-uxbz";

    // 精确模拟详情页查询 — 只查必要字段
    const v = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: {
        brand: true, model: true, year: true, type: true, dealerId: true,
        mileageKm: true, transmission: true, fuelType: true,
        steering: true, exteriorColor: true, interiorColor: true,
        condition: true, basePrice: true, salePrice: true,
        images: { select: { url: true } }, location: true, series: true,
        bodyStyle: true, description: true,
        specId: true, soldAt: true,
      },
    });

    // 模拟 dealer vehicles
    const dvs = v?.dealerId
      ? await prisma.vehicle.findMany({
          where: {
            dealerId: v.dealerId,
            slug: { not: slug },
            status: { in: ["available", "APPROVED", "PUBLISHED"] },
            published: true,
            deleted: false,
          },
          select: {
            slug: true, brand: true, model: true, year: true,
            mileageKm: true, location: true, transmission: true,
            fuelType: true, salePrice: true, images: { select: { url: true } }, soldAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 4,
        })
      : [];

    const imagesMapped = (v?.images || []).map((i: any) => i.url);
    const dealerMapped = dvs.map((d: any) => ({ ...d, images: (d.images || []).map((i: any) => i.url) }));

    return NextResponse.json({
      vehicle: v ? { ...v, images: imagesMapped } : null,
      dealerVehicles: dealerMapped,
      count: await prisma.vehicle.count({ where: { published: true, deleted: false } }),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.slice(0, 500) }, { status: 500 });
  }
}
