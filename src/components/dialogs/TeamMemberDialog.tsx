import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: any;
  onSuccess: () => void;
}

const DEPARTMENTS = ["Executive", "Production", "Strategy", "Creative", "Account", "Business"];

export default function TeamMemberDialog({ open, onOpenChange, member, onSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", employee_id: "", department: "", phone: "", join_date: "", status: "active",
  });
  const [role, setRole] = useState("employee");

  useEffect(() => {
    if (member) {
      setForm({
        full_name: member.full_name || "",
        employee_id: member.employee_id || "",
        department: member.department || "",
        phone: member.phone || "",
        join_date: member.join_date || "",
        status: member.status || "active",
      });
      // Fetch role
      supabase.from("user_roles").select("role").eq("user_id", member.user_id).single().then(({ data }) => {
        if (data) setRole(data.role);
      });
    } else {
      setForm({ full_name: "", employee_id: "", department: "", phone: "", join_date: "", status: "active" });
      setRole("employee");
    }
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !member) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").update(form).eq("id", member.id);
      if (error) throw error;
      // Update role
      const { error: roleErr } = await supabase.from("user_roles").update({ role: role as "admin" | "employee" | "super_admin" }).eq("user_id", member.user_id);
      if (roleErr) throw roleErr;
      await supabase.from("audit_log").insert({
        user_id: user.id, action: "UPDATE", table_name: "profiles",
        record_id: member.id, old_values: member, new_values: form,
      });
      toast.success("Anggota tim berhasil diupdate!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Anggota Tim</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input value={form.employee_id} onChange={(e) => set("employee_id", e.target.value)} placeholder="EMP-001" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={form.department} onValueChange={(v) => set("department", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xxx" />
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input type="date" value={form.join_date} onChange={(e) => set("join_date", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
