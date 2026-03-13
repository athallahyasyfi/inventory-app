import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, type, quantity, note } = body;

  if (!productId || !type || !quantity || quantity <= 0) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  if (type === "out" && product.stock < quantity) {
    return NextResponse.json({ error: `Stok tidak cukup! Stok saat ini: ${product.stock}` }, { status: 400 });
  }

  const newStock = type === "in" ? product.stock + quantity : product.stock - quantity;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data:  { stock: newStock },
    }),
    prisma.stockTransaction.create({
      data: {
        type,
        quantity,
        note:      note ?? null,
        productId,
        userId:    user.id,
      },
    }),
  ]);

  return NextResponse.json({ message: "Mutasi stok berhasil", newStock }, { status: 201 });
}