"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  plus:   "M12 5v14 M5 12h14",
  edit:   "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:  "M3 6h18 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6 M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2",
  search: "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z M16 16l4.5 4.5",
  x:      "M18 6L6 18 M6 6l12 12",
};

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8,
  padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#0f172a",
};

export default function ProductsClient({ products, categories, userRole }) {
  const router = useRouter();
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form, setForm] = useState({
    sku: "", name: "", categoryId: "", price: "", stock: "", minStock: "5",
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({
      sku:        `PRD-${String(products.length + 1).padStart(3, "0")}`,
      name:       "",
      categoryId: String(categories[0]?.id ?? ""),
      price:      "",
      stock:      "",
      minStock:   "5",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      sku:        p.sku,
      name:       p.name,
      categoryId: String(p.categoryId),
      price:      String(p.price),
      stock:      String(p.stock),
      minStock:   String(p.minStock),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.categoryId) return;
    setLoading(true);

    const url    = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku:        form.sku,
        name:       form.name,
        categoryId: parseInt(form.categoryId),
        price:      parseFloat(form.price),
        stock:      parseInt(form.stock),
        minStock:   parseInt(form.minStock),
      }),
    });

    setLoading(false);
    setShowModal(false);
    router.refresh();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setLoading(false);
    setDeleteId(null);
    router.refresh();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#0f172a", fontSize: 22, fontWeight: 700, margin: 0 }}>Manajemen Produk</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{products.length} produk terdaftar</p>
        </div>
        {userRole === "admin" && (
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, background: "#3b82f6", border: "none", borderRadius: 8, padding: "10px 18px", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <Icon d={Icons.plus} size={16} color="white" /> Tambah Produk
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <Icon d={Icons.search} size={16} color="#94a3b8" />
        </div>
        <input
          placeholder="Cari nama produk, SKU, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 40, background: "white" }}
        />
      </div>

      {/* Tabel */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["SKU", "Nama Produk", "Kategori", "Harga", "Stok", "Status", userRole === "admin" ? "Aksi" : ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const isLow = p.stock <= p.minStock;
              return (
                <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 13, fontFamily: "monospace" }}>{p.sku}</td>
                  <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: 600, fontSize: 14 }}>{p.name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: "#eff6ff", color: "#3b82f6", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>{p.category.name}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#0f172a", fontSize: 13 }}>{fmt(p.price)}</td>
                  <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: 700, fontSize: 15 }}>{p.stock}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: isLow ? "#fee2e2" : "#dcfce7", color: isLow ? "#dc2626" : "#16a34a", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                      {isLow ? "⚠ Rendah" : "✓ Aman"}
                    </span>
                  </td>
                  {userRole === "admin" && (
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: "#eff6ff", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", display: "flex" }}>
                          <Icon d={Icons.edit} size={14} color="#3b82f6" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", display: "flex" }}>
                          <Icon d={Icons.trash} size={14} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Tidak ada produk ditemukan.</div>
        )}
      </div>

      {/* ── Modal Tambah/Edit ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                <Icon d={Icons.x} size={16} color="#64748b" />
              </button>
            </div>

            <Field label="SKU">
              <input style={inputStyle} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
            <Field label="Nama Produk *">
              <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Kategori">
              <select style={inputStyle} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Harga (Rp) *">
              <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Field>
            <Field label="Stok *">
              <input style={inputStyle} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </Field>
            <Field label="Minimum Stok (untuk alert)">
              <input style={inputStyle} type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </Field>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 8, padding: 11, background: "white", fontWeight: 600, cursor: "pointer", color: "#64748b" }}>
                Batal
              </button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 1, background: loading ? "#93c5fd" : "#3b82f6", border: "none", borderRadius: 8, padding: 11, color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon d={Icons.trash} size={24} color="#ef4444" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#0f172a" }}>Hapus Produk?</h3>
            <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>Tindakan ini tidak bisa dibatalkan.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 8, padding: 11, background: "white", cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={loading} style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: 8, padding: 11, color: "white", fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}