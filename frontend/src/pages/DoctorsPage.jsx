import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const EMPTY = { name: "", specialty: "", department: "", phone: "", email: "" };
const FIELDS = ["name", "specialty", "department", "phone", "email"];

export default function DoctorsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  async function load() {
    try {
      const res = await api.get("/doctors", { params: { search } });
      setDoctors(res.data.doctors ?? res.data);
    } catch { toast.error("Failed to load"); }
  }

  useEffect(() => { load(); }, [search]);

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(d) { setEditing(d); setForm({ name: d.name, specialty: d.specialty, department: d.department, phone: d.phone || "", email: d.email || "" }); setOpen(true); }

  async function handleSave() {
    try {
      editing ? await api.put(`/doctors/${editing.id}`, form) : await api.post("/doctors", form);
      toast.success(editing ? "Doctor updated" : "Doctor added");
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this doctor?")) return;
    try { await api.delete(`/doctors/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Doctors</h1>
        {isAdmin && (
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={15} /> Add Doctor
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, specialty or department…"
          className="w-full h-9 pl-9 pr-3 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-gray-300 placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Specialty</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
              {isAdmin && <th className="px-4 py-3 w-20"></th>}
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No doctors found</td></tr>
            ) : doctors.map(doc => (
              <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{doc.name}</td>
                <td className="px-4 py-3 text-gray-600">{doc.specialty}</td>
                <td className="px-4 py-3 text-gray-600">{doc.department}</td>
                <td className="px-4 py-3 text-gray-500">{doc.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{doc.email || "—"}</td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(doc)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            <h2 className="text-base font-semibold text-gray-900 mb-5">{editing ? "Edit Doctor" : "Add Doctor"}</h2>
            <div className="space-y-4">
              {FIELDS.map(f => (
                <div key={f}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 capitalize">{f}</label>
                  <input
                    value={form[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    placeholder={f}
                    className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              ))}
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
