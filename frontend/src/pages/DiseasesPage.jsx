import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const EMPTY = { name: "", description: "", severity: "Mild", status: "Active", patient_id: "" };

const SEVERITY_STYLE = {
  Mild: "bg-green-50 text-green-700",
  Moderate: "bg-yellow-50 text-yellow-700",
  Severe: "bg-red-50 text-red-700",
};
const STATUS_STYLE = {
  Active: "bg-blue-50 text-blue-700",
  Recovering: "bg-purple-50 text-purple-700",
  Resolved: "bg-gray-100 text-gray-600",
};

function NativeSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-9 px-3 pr-8 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-gray-400 appearance-none text-gray-900">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  );
}

export default function DiseasesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canEdit = isAdmin || user?.role === "clinician";
  const [diseases, setDiseases] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  async function load() {
    try {
      const [d, p] = await Promise.all([api.get("/diseases", { params: { search } }), api.get("/patients")]);
      setDiseases(d.data.diseases ?? d.data);
      setPatients(p.data.patients ?? p.data);
    } catch { toast.error("Failed to load"); }
  }

  useEffect(() => { load(); }, [search]);

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(d) { setEditing(d); setForm({ name: d.name, description: d.description || "", severity: d.severity, status: d.status, patient_id: d.patient_id ? String(d.patient_id) : "" }); setOpen(true); }

  async function handleSave() {
    try {
      editing ? await api.put(`/diseases/${editing.id}`, form) : await api.post("/diseases", form);
      toast.success(editing ? "Updated" : "Added");
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this record?")) return;
    try { await api.delete(`/diseases/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  }

  const f = (v) => setForm(prev => ({ ...prev, ...v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Diseases</h1>
        {isAdmin && (
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={15} /> Add Disease
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diseases…"
          className="w-full h-9 pl-9 pr-3 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-gray-300 placeholder:text-gray-400" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Patient", "Severity", "Status", "Description"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
              {(canEdit || isAdmin) && <th className="px-4 py-3 w-20"></th>}
            </tr>
          </thead>
          <tbody>
            {diseases.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No diseases found</td></tr>
            ) : diseases.map(d => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-3 text-gray-600">{d.patient_name || "—"}</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLE[d.severity] || "bg-gray-100 text-gray-600"}`}>{d.severity}</span></td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[d.status] || "bg-gray-100 text-gray-600"}`}>{d.status}</span></td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{d.description || "—"}</td>
                {(canEdit || isAdmin) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {canEdit && <button onClick={() => openEdit(d)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"><Pencil size={13} /></button>}
                      {isAdmin && <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            <h2 className="text-base font-semibold text-gray-900 mb-5">{editing ? "Edit Disease" : "Add Disease"}</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Disease Name</label>
                <input value={form.name} onChange={e => f({ name: e.target.value })} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Patient</label>
                <NativeSelect value={form.patient_id} onChange={v => f({ patient_id: v })} options={patients.map(p => ({ value: String(p.id), label: p.name }))} placeholder="Select patient" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Severity</label>
                <NativeSelect value={form.severity} onChange={v => f({ severity: v })} options={["Mild","Moderate","Severe"].map(s => ({ value: s, label: s }))} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <NativeSelect value={form.status} onChange={v => f({ status: v })} options={["Active","Recovering","Resolved"].map(s => ({ value: s, label: s }))} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                <input value={form.description} onChange={e => f({ description: e.target.value })} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
