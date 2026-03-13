import prisma from "@/lib/prisma";
import StokClient from "./StokClient";

export default async function StokPage() {
  const [transactions, products] = await Promise.all([
    prisma.stockTransaction.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true, user: true },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <StokClient transactions={transactions} products={products} />;
}