import prisma from "@/lib/prisma";
import Link from "next/link";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  alert:   "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  check:   "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
};

export default async function AlertsPage() {
  const allProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: { stock: "asc" },
  });

  const lowProducts = allProducts.filter((p) => p.stock <= p.minStock);
  const critical    = lowProducts.filter((p) => p.stock === 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#0f172a", fontSize: 22, fontWeight: 700, margin: 0 }}>Stok Rendah</h2>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
          {lowProducts.length} produk memerlukan perhatian.
        </p>
      </div>

      {/* Banner peringatan kritis */}
      {critical.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <Icon d={Icons.alert} size={18} color="#dc2626" />
          <p style={{ margin: 0, color: "#dc2626", fontWeight: 600, fontSize: 14 }}>
            {critical.length} produk kehabisan stok. Segera lakukan restock.
          </p>
        </div>
      )}

      {/* Grid kartu produk */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {lowProducts.map((p) => {
          const pct   = Math.min(Math.round((p.stock / p.minStock) * 100), 100);
          const color = p.stock === 0 ? "#ef4444" : p.stock < p.minStock * 0.5 ? "#f97316" : "#eab308";
          const label = p.stock === 0 ? "Habis" : "Rendah";

          return (
            <div key={p.id} style={{ background: "white", borderRadius: 12, padding: 20, border: `1px solid ${color}25`, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{p.name}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>{p.sku} · {p.category.name}</p>
                </div>
                <span style={{ background: `${color}15`, color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                  {label}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                <span>Stok saat ini</span>
                <span>Minimum: {p.minStock} unit</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 6, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6 }} />
              </div>

              <p style={{ margin: "10px 0 0", fontWeight: 700, fontSize: 22, color }}>
                {p.stock}
                <span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>unit tersisa</span>
              </p>
            </div>
          );
        })}

        {/* Empty state */}
        {lowProducts.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 52, height: 52, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon d={Icons.check} size={24} color="#16a34a" />
            </div>
            <p style={{ color: "#16a34a", fontWeight: 700, fontSize: 16, margin: "0 0 8px" }}>
              Semua stok dalam kondisi aman.
            </p>
            <Link href="/dashboard/produk" style={{ color: "#3b82f6", fontSize: 14, textDecoration: "none" }}>
              Lihat semua produk
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}