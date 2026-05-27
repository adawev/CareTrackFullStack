import { useEffect, useState } from "react";
import { Stethoscope, Users, Activity } from "lucide-react";
import api from "@/services/api";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#64748b" }}>{title}</span>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, diseases: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [d, p, ds] = await Promise.all([
          api.get("/doctors"),
          api.get("/patients"),
          api.get("/diseases"),
        ]);
        setStats({
          doctors: (d.data.doctors ?? d.data).length,
          patients: (p.data.patients ?? p.data).length,
          diseases: (ds.data.diseases ?? ds.data).length,
        });
      } catch {}
    }
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", marginBottom: "24px" }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <StatCard title="Total Doctors" value={stats.doctors} icon={Stethoscope} color="#3b82f6" />
        <StatCard title="Total Patients" value={stats.patients} icon={Users} color="#10b981" />
        <StatCard title="Total Diseases" value={stats.diseases} icon={Activity} color="#f59e0b" />
      </div>
    </div>
  );
}
