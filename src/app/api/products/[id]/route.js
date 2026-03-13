import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const id   = parseInt(params.id);
  const body = await request.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      sku:        body.sku,
      name:       body.name,
      price:      body.price,
      stock:      body.stock,
      minStock:   body.minStock,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  await prisma.stockTransaction.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Produk berhasil dihapus" });
}