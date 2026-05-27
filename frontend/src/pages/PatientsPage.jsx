import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const EMPTY = { first_name: "", last_name: "", date_of_birth: "", gender: "", blood_type: "", phone: "", email: "", address: "", doctor_id: "" };
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Sel({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-9 px-3 pr-8 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-gray-400 appearance-none">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  );
}

export default function PatientsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canEdit = isAdmin || user?.role === "clinician";
  const canCreate = isAdmin || user?.role === "receptionist";
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  async function load() {
    try {
      const [p, d] = await Promise.all([api.get("/patients", { params: { search } }), api.get("/doctors")]);
      setPatients(p.data.patients ?? p.data);
      setDoctors(d.data.doctors ?? d.data);
    } catch { toast.error("Failed to load"); }
  }

  useEffect(() => { load(); }, [search]);

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p) {
    setEditing(p);
    setForm({ first_name: p.first_name, last_name: p.last_name, date_of_birth: p.date_of_birth?.slice(0, 10) || "", gender: p.gender || "", blood_type: p.blood_type || "", phone: p.phone || "", email: p.email || "", address: p.address || "", doctor_id: p.doctor_id ? String(p.doctor_id) : "" });
    setOpen(true);
  }

  async function handleSave() {
    try {
      const payload = { ...form, doctor_id: form.doctor_id || null };
      editing ? await api.put(`/patients/${editing.id}`, payload) : await api.post("/patients", payload);
      toast.success(editing ? "Patient updated" : "Patient added");
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this patient?")) return;
    try { await api.delete(`/patients/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  }

  const f = v => setForm(prev => ({ ...prev, ...v }));
  const inp = (label, field, type = "text") => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <input type={type} value={form[field]} onChange={e => f({ [field]: e.target.value })}
        className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Patients</h1>
        {canCreate && (
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={15} /> Add Patient
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…"
          className="w-full h-9 pl-9 pr-3 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-gray-300 placeholder:text-gray-400" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "DOB", "Gender", "Blood", "Doctor", "Phone"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
              {(canEdit || isAdmin) && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No patients found</td></tr>
            ) : patients.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{p.first_name} {p.last_name}</td>
                <td className="px-4 py-3 text-gray-600">{p.date_of_birth?.slice(0, 10) || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{p.gender || "—"}</td>
                <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{p.blood_type || "—"}</span></td>
                <td className="px-4 py-3 text-gray-600">{p.doctor_first_name ? `${p.doctor_first_name} ${p.doctor_last_name}` : "—"}</td>
                <td className="px-4 py-3 text-gray-500">{p.phone || "—"}</td>
                {(canEdit || isAdmin) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {canEdit && <button onClick={() => openEdit(p)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"><Pencil size={13} /></button>}
                      {isAdmin && <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>}
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
          <div className="relative z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            <h2 className="text-base font-semibold text-gray-900 mb-5">{editing ? "Edit Patient" : "Add Patient"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {inp("First Name", "first_name")}
                {inp("Last Name", "last_name")}
              </div>
              {inp("Date of Birth", "date_of_birth", "date")}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Gender</label>
                <Sel value={form.gender} onChange={v => f({ gender: v })} options={GENDERS.map(g => ({ value: g, label: g }))} placeholder="Select gender" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Blood Type</label>
                <Sel value={form.blood_type} onChange={v => f({ blood_type: v })} options={BLOOD_TYPES.map(b => ({ value: b, label: b }))} placeholder="Select blood type" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Assigned Doctor</label>
                <Sel value={form.doctor_id} onChange={v => f({ doctor_id: v })} options={doctors.map(d => ({ value: String(d.id), label: `${d.first_name} ${d.last_name}` }))} placeholder="Select doctor" />
              </div>
              {inp("Phone", "phone")}
              {inp("Email", "email", "email")}
              {inp("Address", "address")}
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
