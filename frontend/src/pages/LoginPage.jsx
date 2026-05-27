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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "0 16px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#111827", marginBottom: "20px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: "0 0 6px" }}>Welcome back</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Sign in to CareTrack</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: "36px 36px 32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ height: "44px" }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ height: "44px" }}
                required
              />
            </div>

            <Button type="submit" style={{ height: "44px", fontSize: "15px", marginTop: "4px" }} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#111827", fontWeight: "600", textDecoration: "none" }}>
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
