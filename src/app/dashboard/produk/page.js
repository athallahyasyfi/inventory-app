import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default async function ProdukPage() {
  const session = await getServerSession();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProductsClient
      products={products}
      categories={categories}
      userRole={session?.user?.role ?? "staff"}
    />
  );
}