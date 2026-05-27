import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Activity } from "lucide-react";
import api from "@/services/api";

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
          doctors: d.data.length,
          patients: p.data.length,
          diseases: ds.data.length,
        });
      } catch {}
    }
    load();
  }, []);

  const cards = [
    { title: "Total Doctors", value: stats.doctors, icon: Stethoscope },
    { title: "Total Patients", value: stats.patients, icon: Users },
    { title: "Total Diseases", value: stats.diseases, icon: Activity },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
              <Icon size={18} className="text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
