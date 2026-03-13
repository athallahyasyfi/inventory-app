import { PrismaClient } from "@prisma/client";

// Mencegah membuat koneksi baru setiap kali hot-reload di development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;