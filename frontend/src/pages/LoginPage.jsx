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

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "16px" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "#0f172a", fontWeight: "500" }}>Register</Link>
        </p>

      </div>
    </div>
  );
}
