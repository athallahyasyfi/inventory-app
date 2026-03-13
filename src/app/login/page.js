"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validasi sederhana di frontend
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah!");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "40px 36px", width: "100%", maxWidth: 380,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ color: "#0f172a", fontSize: 20, fontWeight: 700, margin: 0 }}>
              InvenTrack
            </h1>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            Masuk ke akun kamu
          </p>
        </div>

        {/* Input Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            placeholder="admin@inventory.com"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8,
              padding: "10px 12px", fontSize: 14, outline: "none",
              boxSizing: "border-box", color: "#0f172a",
            }}
          />
        </div>

        {/* Input Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8,
              padding: "10px 12px", fontSize: 14, outline: "none",
              boxSizing: "border-box", color: "#0f172a",
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
            padding: "10px 12px", color: "#dc2626", fontSize: 13, marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#93c5fd" : "#3b82f6",
            border: "none", borderRadius: 8, padding: "11px",
            color: "white", fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
          }}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Hint akun demo */}
        <div style={{ marginTop: 20, padding: "12px", background: "#f8fafc", borderRadius: 8 }}>
          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 4px", fontWeight: 600 }}>Akun Demo:</p>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0" }}>Admin: admin@inventory.com / admin123</p>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0" }}>Staff: staff@inventory.com / staff123</p>
        </div>

      </div>
    </div>
  );
}