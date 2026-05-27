import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const EMPTY = { name: "", date_of_birth: "", gender: "", blood_type: "", phone: "", address: "", doctor_id: "" };

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
      const [p, d] = await Promise.all([
        api.get("/patients", { params: { search } }),
        api.get("/doctors"),
      ]);
      setPatients(p.data);
      setDoctors(d.data);
    } catch {
      toast.error("Failed to load patients");
    }
  }

  useEffect(() => { load(); }, [search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name, date_of_birth: p.date_of_birth?.slice(0, 10) || "",
      gender: p.gender || "", blood_type: p.blood_type || "",
      phone: p.phone || "", address: p.address || "",
      doctor_id: p.doctor_id ? String(p.doctor_id) : "",
    });
    setOpen(true);
  }

  async function handleSave() {
    try {
      const payload = { ...form, doctor_id: form.doctor_id || null };
      if (editing) {
        await api.put(`/patients/${editing.id}`, payload);
        toast.success("Patient updated");
      } else {
        await api.post("/patients", payload);
        toast.success("Patient added");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving patient");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient deleted");
      load();
    } catch {
      toast.error("Failed to delete patient");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Patients</h2>
        {canCreate && (
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} className="mr-2" /> Add Patient
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search by name or blood type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Phone</TableHead>
              {(canEdit || isAdmin) && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.date_of_birth?.slice(0, 10) || "—"}</TableCell>
                  <TableCell>
                    {p.gender ? <Badge variant="outline">{p.gender}</Badge> : "—"}
                  </TableCell>
                  <TableCell>{p.blood_type || "—"}</TableCell>
                  <TableCell>{p.doctor_name || "—"}</TableCell>
                  <TableCell>{p.phone || "—"}</TableCell>
                  {(canEdit || isAdmin) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                            <Pencil size={14} />
                          </Button>
                        )}
                        {isAdmin && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                            <Trash2 size={14} className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Patient" : "Add Patient"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Gender</label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Blood Type</label>
              <Select value={form.blood_type} onValueChange={(v) => setForm({ ...form, blood_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => (
                    <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Assigned Doctor</label>
              <Select value={form.doctor_id} onValueChange={(v) => setForm({ ...form, doctor_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Address</label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
