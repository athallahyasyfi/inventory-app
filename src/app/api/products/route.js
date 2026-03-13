import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.price || body.stock === undefined) {
    return NextResponse.json({ error: "Field tidak lengkap" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      sku:        body.sku,
      name:       body.name,
      price:      body.price,
      stock:      body.stock,
      minStock:   body.minStock ?? 5,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(product, { status: 201 });
}