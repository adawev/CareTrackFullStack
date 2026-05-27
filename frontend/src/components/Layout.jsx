import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Stethoscope, Users, Activity, LayoutDashboard, LogOut } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/doctors", label: "Doctors", icon: Stethoscope },
  { path: "/patients", label: "Patients", icon: Users },
  { path: "/diseases", label: "Diseases", icon: Activity },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc" }}>
      <aside style={{ width: "220px", flexShrink: 0, backgroundColor: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>CareTrack</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Medical Record System</div>
        </div>

        <nav style={{ flex: 1, padding: "8px" }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", borderRadius: "6px", marginBottom: "2px",
                  fontSize: "13px", fontWeight: "500", textDecoration: "none",
                  backgroundColor: active ? "#f1f5f9" : "transparent",
                  color: active ? "#0f172a" : "#64748b",
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>{user?.username}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "capitalize", marginBottom: "10px" }}>{user?.role}</div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "6px", width: "100%",
              padding: "7px 10px", borderRadius: "6px", border: "1px solid #e2e8f0",
              backgroundColor: "#fff", color: "#64748b", fontSize: "13px", cursor: "pointer",
            }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", padding: "32px" }}>
        {children}
      </main>
    </div>
  );
}
