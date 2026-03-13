import prisma from "@/lib/prisma";
import Link from "next/link";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  box:      "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  alert:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
};

function StatCard({ label, value, sub, color, iconD }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9", flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>{label}</p>
          <p style={{ color: "#0f172a", fontSize: 26, fontWeight: 700, margin: "6px 0 4px" }}>{value}</p>
          {sub && <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{sub}</p>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={iconD} size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [products, transactions] = await Promise.all([
    prisma.product.findMany({ include: { category: true } }),
    prisma.stockTransaction.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { product: true, user: true },
    }),
  ]);

  const totalProducts = products.length;
  const totalStock    = products.reduce((s, p) => s + p.stock, 0);
  const totalValue    = products.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStock      = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#0f172a", fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h2>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Ringkasan inventori terkini.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Produk"    value={totalProducts}   sub="jenis produk"  color="#3b82f6" iconD={Icons.box} />
        <StatCard label="Total Stok"      value={totalStock}      sub="unit tersedia" color="#10b981" iconD={Icons.trending} />
        <StatCard label="Nilai Inventori" value={fmt(totalValue)} sub="total aset"    color="#8b5cf6" iconD={Icons.tag} />
        <StatCard label="Stok Rendah"     value={lowStock}        sub="perlu restock" color="#ef4444" iconD={Icons.alert} />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Transaksi Terbaru */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9", flex: 2, minWidth: 300 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, margin: 0 }}>Transaksi Terbaru</h3>
            <Link href="/dashboard/stok" style={{ color: "#3b82f6", fontSize: 13, textDecoration: "none" }}>Lihat semua</Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Produk", "Tipe", "Qty", "Oleh"].map((h) => (
                  <th key={h} style={{ textAlign: "left", color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: "10px 0", color: "#0f172a", fontSize: 13, fontWeight: 500 }}>{t.product.name}</td>
                  <td style={{ padding: "10px 0" }}>
                    <span style={{ background: t.type === "in" ? "#dcfce7" : "#fee2e2", color: t.type === "in" ? "#16a34a" : "#dc2626", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
                      {t.type === "in" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 0", color: "#0f172a", fontWeight: 600, fontSize: 13 }}>{t.quantity}</td>
                  <td style={{ padding: "10px 0", color: "#64748b", fontSize: 13 }}>{t.user.name}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "24px 0", color: "#94a3b8", fontSize: 13, textAlign: "center" }}>Belum ada transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Perlu Restock */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9", flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, margin: 0 }}>Perlu Restock</h3>
            <Link href="/dashboard/alerts" style={{ color: "#3b82f6", fontSize: 13, textDecoration: "none" }}>Lihat semua</Link>
          </div>
          {products.filter((p) => p.stock <= p.minStock).slice(0, 5).map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{p.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>Min: {p.minStock} unit</p>
              </div>
              <span style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 13 }}>{p.stock}</span>
            </div>
          ))}
          {products.filter((p) => p.stock <= p.minStock).length === 0 && (
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Semua stok dalam kondisi aman.</p>
          )}
        </div>

      </div>
    </div>
  );
}