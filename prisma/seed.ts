import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 管理员账号
  const adminEmail = "admin@honglajiao1688.com";
  const adminPassword = bcrypt.hashSync("Admin@1688#hj", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
      phone: "+8613800000000",
      company: "Honglajiao Auto Export",
      country: "China",
    },
  });

  console.log("✅ Admin account seeded: admin@honglajiao1688.com / Admin@1688#hj");

  // 样例经销商
  const dealerEmail = "dealer@honglajiao1688.com";
  await prisma.user.upsert({
    where: { email: dealerEmail },
    update: {},
    create: {
      email: dealerEmail,
      password: bcrypt.hashSync("Dealer@1688#hj", 12),
      name: "Demo Dealer",
      role: "dealer",
      company: "Africa Auto Trading Co.",
      country: "Nigeria",
    },
  });
  console.log("✅ Dealer account seeded: dealer@honglajiao1688.com / Dealer@1688#hj");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
