import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      <div style={{ width: "360px" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}>CareTrack</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Sign in to your account</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Email</label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Password</label>
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

          </form>
        </div>

        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick access</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Admin", email: "admin@admin.com", password: "admin" },
              { label: "Clinician", email: "clinician@clinician.com", password: "clinician" },
              { label: "Receptionist", email: "receptionist@receptionist.com", password: "receptionist" },
            ].map(({ label, email, password }) => (
              <button key={label} type="button"
                onClick={() => setForm({ email, password })}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "13px", color: "#0f172a" }}>
                <span style={{ fontWeight: "500" }}>{label}</span>
                <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{email}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "12px" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "#0f172a", fontWeight: "500" }}>Register</Link>
        </p>

      </div>
    </div>
  );
}
