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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const EMPTY = { name: "", specialty: "", department: "", phone: "", email: "" };

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
      setDoctors(res.data);
    } catch {
      toast.error("Failed to load doctors");
    }
  }

  useEffect(() => { load(); }, [search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(doc) {
    setEditing(doc);
    setForm({ name: doc.name, specialty: doc.specialty, department: doc.department, phone: doc.phone || "", email: doc.email || "" });
    setOpen(true);
  }

  async function handleSave() {
    try {
      if (editing) {
        await api.put(`/doctors/${editing.id}`, form);
        toast.success("Doctor updated");
      } else {
        await api.post("/doctors", form);
        toast.success("Doctor added");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving doctor");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      toast.success("Doctor deleted");
      load();
    } catch {
      toast.error("Failed to delete doctor");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Doctors</h2>
        {isAdmin && (
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} className="mr-2" /> Add Doctor
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search by name, specialty or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              {isAdmin && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.specialty}</TableCell>
                  <TableCell>{doc.department}</TableCell>
                  <TableCell>{doc.phone || "—"}</TableCell>
                  <TableCell>{doc.email || "—"}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(doc)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {["name", "specialty", "department", "phone", "email"].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium capitalize">{field}</label>
                <Input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={field}
                />
              </div>
            ))}
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
