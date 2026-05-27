import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "receptionist" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Account created. Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      <div style={{ width: "360px" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}>CareTrack</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Create a new account</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Username</label>
              <Input placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Email</label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Password</label>
              <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>Role</label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="clinician">Clinician</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>

          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "16px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0f172a", fontWeight: "500" }}>Sign in</Link>
        </p>

      </div>
    </div>
  );
}
