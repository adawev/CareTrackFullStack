import { useEffect, useState } from "react";
import { Stethoscope, Users, Activity } from "lucide-react";
import api from "@/services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, diseases: 0 });

  useEffect(() => {
    Promise.all([api.get("/doctors"), api.get("/patients"), api.get("/diseases")])
      .then(([d, p, ds]) => setStats({
        doctors: (d.data.doctors ?? d.data).length,
        patients: (p.data.patients ?? p.data).length,
        diseases: (ds.data.diseases ?? ds.data).length,
      }))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total Doctors", value: stats.doctors, icon: Stethoscope, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Total Patients", value: stats.patients, icon: Users, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Total Diseases", value: stats.diseases, icon: Activity, bg: "bg-amber-50", color: "text-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{label}</span>
              <div className={`${bg} rounded-lg p-2`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
