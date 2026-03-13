"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  box:       "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  trending:  "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  alert:     "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  menu:      "M3 12h18 M3 6h18 M3 18h18",
  user:      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
};

const navMenu = [
  { href: "/dashboard",        label: "Dashboard",    icon: Icons.dashboard },
  { href: "/dashboard/produk", label: "Produk",       icon: Icons.box },
  { href: "/dashboard/stok",   label: "Mutasi Stok",  icon: Icons.trending },
  { href: "/dashboard/alerts", label: "Stok Rendah",  icon: Icons.alert },
];

export default function DashboardLayout({ children }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const W = collapsed ? 64 : 220;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: W, minHeight: "100vh", background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transition: "width .2s", overflow: "hidden", flexShrink: 0 }}>

        {/* inventrack */}
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {!collapsed && <span style={{ color: "white", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>InvenTrack</span>}
        </div>

        {/* Nav Menu */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navMenu.map((m) => {
            const isActive = pathname === m.href;
            return (
              <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 13px" : "11px 14px", borderRadius: 10, background: isActive ? "rgba(59,130,246,0.2)" : "transparent", color: isActive ? "#60a5fa" : "#64748b", cursor: "pointer", marginBottom: 2, transition: "all .15s" }}>
                  <Icon d={m.icon} size={18} color={isActive ? "#60a5fa" : "#64748b"} />
                  {!collapsed && <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>{m.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {!collapsed && session && (
            <div style={{ padding: "10px 14px", marginBottom: 4 }}>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0 }}>{session.user.name}</p>
              <p style={{ color: "#475569", fontSize: 11, margin: "2px 0 0" }}>{session.user.role?.toUpperCase()}</p>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 13px" : "11px 14px", borderRadius: 10, border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}>
            <Icon d={Icons.logout} size={18} color="#ef4444" />
            {!collapsed && <span style={{ fontSize: 14 }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon d={Icons.menu} size={20} color="#64748b" />
          </button>
          {session && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, background: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={Icons.user} size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{session.user.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{session.user.role?.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}