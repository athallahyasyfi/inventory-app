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
  plus:  "M12 5v14 M5 12h14",
  x:     "M18 6L6 18 M6 6l12 12",
  up:    "M12 19V5 M5 12l7-7 7 7",
  down:  "M12 5v14 M19 12l-7 7-7-7",
};

const fmt = (date) =>
  new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const inputStyle = {
  width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8,
  padding: "10px 12px", fontSize: 14, outline: "none",
  boxSizing: "border-box", color: "#0f172a",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

export default function StokClient({ transactions, products }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [form, setForm] = useState({ productId: "", type: "in", quantity: "", note: "" });

  const handleSave = async () => {
    if (!form.productId || !form.quantity || +form.quantity <= 0) {
      setError("Produk dan jumlah wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(form.productId),
        type:      form.type,
        quantity:  parseInt(form.quantity),
        note:      form.note,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowModal(false);
    setForm({ productId: "", type: "in", quantity: "", note: "" });
    router.refresh();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#0f172a", fontSize: 22, fontWeight: 700, margin: 0 }}>Mutasi Stok</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Riwayat stok masuk & keluar</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#3b82f6", border: "none", borderRadius: 8, padding: "10px 18px", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          <Icon d={Icons.plus} size={16} color="white" /> Input Mutasi
        </button>
      </div>

      {/* Tabel */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["Tanggal", "Produk", "Tipe", "Jumlah", "Catatan", "Dicatat Oleh"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: 13 }}>{fmt(t.createdAt)}</td>
                <td style={{ padding: "13px 16px", color: "#0f172a", fontWeight: 600, fontSize: 14 }}>{t.product.name}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: t.type === "in" ? "#dcfce7" : "#fee2e2", color: t.type === "in" ? "#16a34a" : "#dc2626", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                    <Icon d={t.type === "in" ? Icons.down : Icons.up} size={11} color={t.type === "in" ? "#16a34a" : "#dc2626"} />
                    {t.type === "in" ? "Masuk" : "Keluar"}
                  </span>
                </td>
                <td style={{ padding: "13px 16px", fontWeight: 700, fontSize: 15, color: t.type === "in" ? "#16a34a" : "#dc2626" }}>
                  {t.type === "in" ? "+" : "-"}{t.quantity}
                </td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: 13 }}>{t.note ?? "-"}</td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: 13 }}>{t.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Belum ada transaksi.</div>
        )}
      </div>

      {/* Modal Input Mutasi */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Input Mutasi Stok</h3>
              <button onClick={() => { setShowModal(false); setError(""); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                <Icon d={Icons.x} size={16} color="#64748b" />
              </button>
            </div>

            <Field label="Produk *">
              <select style={inputStyle} value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                <option value="">-- Pilih Produk --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                ))}
              </select>
            </Field>

            <Field label="Tipe">
              <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="in">Stok Masuk</option>
                <option value="out">Stok Keluar</option>
              </select>
            </Field>

            <Field label="Jumlah *">
              <input style={inputStyle} type="number" min="1" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </Field>

            <Field label="Catatan">
              <input style={inputStyle} type="text" placeholder="Misal: Restock dari supplier"
                value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </Field>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowModal(false); setError(""); }} style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 8, padding: 11, background: "white", fontWeight: 600, cursor: "pointer", color: "#64748b" }}>
                Batal
              </button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 1, background: loading ? "#93c5fd" : "#3b82f6", border: "none", borderRadius: 8, padding: 11, color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}