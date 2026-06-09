import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const slug = "peugeot-标致408-2020-z11v";
  console.log("查询 slug:", slug);
  
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug, deleted: false },
    select: {
      brand: true, model: true, year: true,
      VehicleSpec: { select: { specs: true } },
    },
  });
  
  console.log("结果:", JSON.stringify(vehicle, null, 2));
  
  if (!vehicle) {
    console.log("未找到车辆，尝试不带 deleted 条件...");
    const v2 = await prisma.vehicle.findUnique({
      where: { slug },
      select: { brand: true, model: true, year: true, deleted: true, published: true },
    });
    console.log("不带 deleted:", JSON.stringify(v2, null, 2));
  }
}

main().catch(e => { console.error("错误:", e); process.exit(1); });
