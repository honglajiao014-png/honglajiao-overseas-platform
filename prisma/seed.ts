import { PrismaClient } from "@prisma/client";
// @ts-nocheck
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
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

  console.log("✅ Admin account seeded");
  console.log("   Email: admin@honglajiao1688.com");
  console.log("   Password: Admin@1688#hj");

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
