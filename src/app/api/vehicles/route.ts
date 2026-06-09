import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** 公开车辆列表 API */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 0;
  const year = Number(searchParams.get("year")) || 0;
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;
  const sort = searchParams.get("sort") || "newest";

  const where: any = { published: true, deleted: false };

  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }
  if (minPrice > 0) {
    where.salePrice = { ...(where.salePrice || {}), gte: minPrice };
  }
  if (maxPrice > 0) {
    where.salePrice = { ...(where.salePrice || {}), lte: maxPrice };
  }
  if (year > 0) {
    where.year = year;
  }

  const orderBy: any =
    sort === "price_asc" ? { salePrice: "asc" } :
    sort === "price_desc" ? { salePrice: "desc" } :
    sort === "oldest" ? { year: "asc" } :
    { createdAt: "desc" };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        slug: true,
        brand: true,
        model: true,
        year: true,
        type: true,
        mileage: true,
        transmission: true,
        fuel: true,
        fuelType: true,
        steering: true,
        exteriorColor: true,
        interiorColor: true,
        condition: true,
        images: true,
        basePrice: true,
        salePrice: true,
        location: true,
        series: true,
        bodyStyle: true,
        description: true,
        displacement: true,
        engineModel: true,
        specsJson: true,
        createdAt: true,
      },
    }),
    prisma.vehicle.count({ where }),
  ]);

  return NextResponse.json({ vehicles, total, limit, offset });
}
