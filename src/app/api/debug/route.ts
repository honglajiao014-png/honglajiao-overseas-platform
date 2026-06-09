import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slug = "peugeot-标致408-2020-z11v";

    // 测试1: 简单查询
    const v1 = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: { slug: true, brand: true, model: true, deleted: true, published: true },
    });

    // 测试2: 不加 deleted 过滤
    const v2 = await prisma.vehicle.findUnique({
      where: { slug },
      select: { slug: true, brand: true, model: true, deleted: true, published: true },
    });

    // 测试3: 带 VehicleSpec
    const v3 = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: {
        brand: true, model: true, year: true,
        VehicleSpec: { select: { specs: true } },
      },
    });

    // 测试4: 完整模拟详情页查询（所有字段）
    const v4 = await prisma.vehicle.findUnique({
      where: { slug, deleted: false },
      select: {
        brand: true, model: true, year: true, type: true, dealerId: true,
        mileage: true, transmission: true, fuel: true,
        steering: true, exteriorColor: true, interiorColor: true,
        condition: true, basePrice: true, salePrice: true,
        images: true, location: true, series: true,
        bodyStyle: true, description: true, equipmentType: true,
        workingHours: true, tonnage: true, loadCapacityTons: true,
        seatCount: true, engineModel: true, batteryType: true,
        rangeKm: true, displacement: true, motorcycleType: true,
        partCategory: true, partCondition: true,
        motorPowerKw: true, vehicleLengthM: true, specsJson: true,
        doorCount: true, driveType: true, maxHorsepower: true,
        maxTorqueNm: true, wheelbase: true, curbWeight: true,
        fuelConsumption: true, fuelTankCapacity: true, fuelGrade: true,
        specId: true,
        VehicleSpec: { select: { specs: true } },
      },
    });

    const count = await prisma.vehicle.count({ where: { published: true, deleted: false } });

    return NextResponse.json({
      test1_withDeleted: v1,
      test2_withoutDeleted: v2,
      test3_withSpec: v3 ? { brand: v3.brand, model: v3.model, year: v3.year, hasSpec: !!v3.VehicleSpec } : null,
      test4_fullDetailQuery: v4 ? { brand: v4.brand, model: v4.model, year: v4.year, salePrice: v4.salePrice, found: true } : { found: false },
      test5_count: count,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
