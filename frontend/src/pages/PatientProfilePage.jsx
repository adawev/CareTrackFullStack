import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";
import { ArrowLeft, User, Stethoscope, Activity } from "lucide-react";

const SEVERITY_STYLE = {
  mild: "bg-green-50 text-green-700",
  moderate: "bg-yellow-50 text-yellow-700",
  severe: "bg-red-50 text-red-700",
};
const STATUS_STYLE = {
  active: "bg-blue-50 text-blue-700",
  chronic: "bg-purple-50 text-purple-700",
  resolved: "bg-gray-100 text-gray-600",
};

export default function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/patients/${id}`)
      .then(res => {
        setPatient(res.data.patient);
        setDiseases(res.data.diseases || []);
      })
      .catch(() => toast.error("Failed to load patient"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>;
  if (!patient) return <div className="text-sm text-gray-400 py-12 text-center">Patient not found</div>;

  return (
    <div>
      <button onClick={() => navigate("/patients")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Patients
      </button>

      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        {patient.first_name} {patient.last_name}
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Patient info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 rounded-lg p-1.5"><User size={14} className="text-gray-600" /></div>
            <span className="text-sm font-medium text-gray-900">Patient Details</span>
          </div>
          <div className="space-y-2.5">
            {[
              ["Date of Birth", patient.date_of_birth?.slice(0, 10) || "—"],
              ["Gender", patient.gender || "—"],
              ["Blood Type", patient.blood_type || "—"],
              ["Phone", patient.phone || "—"],
              ["Email", patient.email || "—"],
              ["Address", patient.address || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned doctor */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-50 rounded-lg p-1.5"><Stethoscope size={14} className="text-blue-600" /></div>
            <span className="text-sm font-medium text-gray-900">Assigned Doctor</span>
          </div>
          {patient.doctor_first_name ? (
            <div className="space-y-2.5">
              {[
                ["Name", `${patient.doctor_first_name} ${patient.doctor_last_name}`],
                ["Specialty", patient.specialty || "—"],
                ["Department", patient.department || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No doctor assigned</p>
          )}
        </div>
      </div>

      {/* Disease/Diagnosis records */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <div className="bg-amber-50 rounded-lg p-1.5"><Activity size={14} className="text-amber-600" /></div>
          <span className="text-sm font-medium text-gray-900">Disease / Diagnosis Records</span>
          <span className="ml-auto text-xs text-gray-400">{diseases.length} record{diseases.length !== 1 ? "s" : ""}</span>
        </div>
        {diseases.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">No disease records found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["ICD Code", "Description", "Severity", "Status", "Diagnosis Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diseases.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{d.icd_code}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{d.description || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLE[d.severity] || "bg-gray-100 text-gray-600"}`}>{d.severity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[d.status] || "bg-gray-100 text-gray-600"}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{d.diagnosis_date?.slice(0, 10) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
