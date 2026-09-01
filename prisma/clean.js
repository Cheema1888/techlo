const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clean() {
  console.log("🧹 Wiping all dummy/test records for clean deployment...");
  await prisma.savedItem.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✨ Database is now 100% clean and ready for real production users!");
}

clean()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
