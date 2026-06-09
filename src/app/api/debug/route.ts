import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slug = "peugeot-标致408-2020-z11v";

    const v1 = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: { slug: true, brand: true, model: true, deleted: true, published: true },
    });

    const v2 = await prisma.vehicle.findUnique({
      where: { slug },
      select: { slug: true, brand: true, model: true, deleted: true, published: true },
    });

    const v3 = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: {
        brand: true, model: true, year: true,
        VehicleSpec: { select: { specs: true } },
      },
    });

    const count = await prisma.vehicle.count({ where: { published: true, deleted: false } });

    return NextResponse.json({
      test1_withDeleted: v1,
      test2_withoutDeleted: v2,
      test3_withSpec: v3 ? { brand: v3.brand, model: v3.model, year: v3.year, hasSpec: !!v3.VehicleSpec } : null,
      test4_count: count,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
