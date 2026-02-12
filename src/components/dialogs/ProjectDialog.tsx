import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: any;
  onSuccess: () => void;
}

export default function ProjectDialog({ open, onOpenChange, project, onSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [form, setForm] = useState({
    project_id: "", name: "", client_id: "", service_category: "", service_type: "",
    package: "", start_date: "", end_date: "", status: "briefing", project_lead: "", editor: "", notes: "",
  });

  useEffect(() => {
    if (open) {
      supabase.from("clients").select("id, brand_name").then(({ data }) => data && setClients(data));
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => data && setMembers(data));
    }
  }, [open]);

  useEffect(() => {
    if (project) {
      setForm({
        project_id: project.project_id || "", name: project.name || "", client_id: project.client_id || "",
        service_category: project.service_category || "", service_type: project.service_type || "",
        package: project.package || "", start_date: project.start_date || "", end_date: project.end_date || "",
        status: project.status || "briefing", project_lead: project.project_lead || "", editor: project.editor || "",
        notes: project.notes || "",
      });
    } else {
      setForm({ project_id: "", name: "", client_id: "", service_category: "", service_type: "", package: "", start_date: "", end_date: "", status: "briefing", project_lead: "", editor: "", notes: "" });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const payload = { ...form, created_by: user.id, client_id: form.client_id || null, project_lead: form.project_lead || null, editor: form.editor || null };
      if (project) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
        await supabase.from("audit_log").insert({ user_id: user.id, action: "UPDATE", table_name: "projects", record_id: project.id, old_values: project, new_values: payload });
        toast.success("Project berhasil diupdate!");
      } else {
        const { data, error } = await supabase.from("projects").insert(payload).select().single();
        if (error) throw error;
        await supabase.from("audit_log").insert({ user_id: user.id, action: "INSERT", table_name: "projects", record_id: data.id, new_values: payload });
        toast.success("Project berhasil ditambahkan!");
      }
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{project ? "Edit Project" : "Tambah Project Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project ID</Label>
              <Input value={form.project_id} onChange={(e) => set("project_id", e.target.value)} placeholder="PRJ-001" required />
            </div>
            <div className="space-y-2">
              <Label>Nama Project</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama project" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.brand_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service Category</Label>
              <Select value={form.service_category} onValueChange={(v) => set("service_category", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="video_production">Video Production</SelectItem>
                  <SelectItem value="branding">Branding</SelectItem>
                  <SelectItem value="data_insight">Data Insight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Package</Label>
              <Select value={form.package || ""} onValueChange={(v) => set("package", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="essentials">Essentials</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                  <SelectItem value="prime">Prime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="briefing">Briefing</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in production">In Production</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="revision">Revision</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Lead</Label>
              <Select value={form.project_lead} onValueChange={(v) => set("project_lead", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  {members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Editor</Label>
              <Select value={form.editor} onValueChange={(v) => set("editor", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  {members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{project ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
