const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Elektronik" }, update: {}, create: { name: "Elektronik" } }),
    prisma.category.upsert({ where: { name: "Aksesori" },   update: {}, create: { name: "Aksesori" } }),
    prisma.category.upsert({ where: { name: "Furnitur" },   update: {}, create: { name: "Furnitur" } }),
    prisma.category.upsert({ where: { name: "ATK" },        update: {}, create: { name: "ATK" } }),
  ]);
  console.log("✅ Kategori dibuat");

  const adminPass = await bcrypt.hash("admin123", 10);
  const staffPass = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@inventory.com" },
    update: {},
    create: { name: "Admin Utama", email: "admin@inventory.com", password: adminPass, role: "admin" },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@inventory.com" },
    update: {},
    create: { name: "Staff Gudang", email: "staff@inventory.com", password: staffPass, role: "staff" },
  });
  console.log("✅ User dibuat");

  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "PRD-001" }, update: {},
      create: { sku: "PRD-001", name: "Laptop Asus VivoBook", price: 7500000, stock: 12, minStock: 5, categoryId: categories[0].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-002" }, update: {},
      create: { sku: "PRD-002", name: "Mouse Logitech M235", price: 185000, stock: 3, minStock: 10, categoryId: categories[1].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-003" }, update: {},
      create: { sku: "PRD-003", name: "Keyboard Mechanical", price: 450000, stock: 8, minStock: 5, categoryId: categories[1].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-004" }, update: {},
      create: { sku: "PRD-004", name: "Monitor LG 24 inch", price: 2800000, stock: 2, minStock: 3, categoryId: categories[0].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-005" }, update: {},
      create: { sku: "PRD-005", name: "Headphone Sony WH", price: 1200000, stock: 15, minStock: 5, categoryId: categories[0].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-006" }, update: {},
      create: { sku: "PRD-006", name: "Kabel HDMI 2m", price: 75000, stock: 1, minStock: 20, categoryId: categories[1].id },
    }),
    prisma.product.upsert({
      where: { sku: "PRD-007" }, update: {},
      create: { sku: "PRD-007", name: "USB Hub 4 Port", price: 120000, stock: 20, minStock: 10, categoryId: categories[1].id },
    }),
  ]);
  console.log("✅ Produk dibuat");

  await prisma.stockTransaction.createMany({
    data: [
      { type: "in",  quantity: 5,  note: "Restock dari supplier", productId: products[0].id, userId: admin.id },
      { type: "out", quantity: 7,  note: "Penjualan",             productId: products[1].id, userId: staff.id },
      { type: "in",  quantity: 3,  note: "Restock",               productId: products[2].id, userId: admin.id },
      { type: "out", quantity: 1,  note: "Penjualan",             productId: products[3].id, userId: staff.id },
      { type: "in",  quantity: 10, note: "Restock dari supplier", productId: products[4].id, userId: admin.id },
      { type: "out", quantity: 9,  note: "Penjualan",             productId: products[5].id, userId: staff.id },
    ],
  });
  console.log("✅ Transaksi dibuat");

  console.log("Seeding selesai!");
  console.log("Login Admin : admin@inventory.com / admin123");
  console.log("Login Staff : staff@inventory.com / staff123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });