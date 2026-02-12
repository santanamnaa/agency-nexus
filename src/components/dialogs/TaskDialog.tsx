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
  task?: any;
  onSuccess: () => void;
}

const APPROVAL_STEPS = ["draft", "pl review", "ad review", "pm review", "client review", "final", "published"];

export default function TaskDialog({ open, onOpenChange, task, onSuccess }: Props) {
  const { user, isAdminOrAbove } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", project_id: "", medium: "", pillar: "", emotional_angle: "",
    brief: "", script: "", caption: "", reference_url: "", status: "draft", approval_status: "draft",
    start_date: "", due_date: "", assigned_pl: "", assigned_editor: "", assigned_videographer: "", assigned_copywriter: "",
  });

  useEffect(() => {
    if (open) {
      supabase.from("projects").select("id, name, project_id").then(({ data }) => data && setProjects(data));
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => data && setMembers(data));
    }
  }, [open]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "", description: task.description || "", project_id: task.project_id || "",
        medium: task.medium || "", pillar: task.pillar || "", emotional_angle: task.emotional_angle || "",
        brief: task.brief || "", script: task.script || "", caption: task.caption || "",
        reference_url: task.reference_url || "", status: task.status || "draft",
        approval_status: task.approval_status || "draft", start_date: task.start_date || "",
        due_date: task.due_date || "", assigned_pl: task.assigned_pl || "",
        assigned_editor: task.assigned_editor || "", assigned_videographer: task.assigned_videographer || "",
        assigned_copywriter: task.assigned_copywriter || "",
      });
    } else {
      setForm({ title: "", description: "", project_id: "", medium: "", pillar: "", emotional_angle: "", brief: "", script: "", caption: "", reference_url: "", status: "draft", approval_status: "draft", start_date: "", due_date: "", assigned_pl: "", assigned_editor: "", assigned_videographer: "", assigned_copywriter: "" });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        created_by: user.id,
        assigned_pl: form.assigned_pl || null,
        assigned_editor: form.assigned_editor || null,
        assigned_videographer: form.assigned_videographer || null,
        assigned_copywriter: form.assigned_copywriter || null,
        start_date: form.start_date || null,
        due_date: form.due_date || null,
      };
      if (task) {
        const { error } = await supabase.from("tasks").update(payload).eq("id", task.id);
        if (error) throw error;
        await supabase.from("audit_log").insert({ user_id: user.id, action: "UPDATE", table_name: "tasks", record_id: task.id, old_values: task, new_values: payload });
        toast.success("Task berhasil diupdate!");
      } else {
        const { data, error } = await supabase.from("tasks").insert(payload).select().single();
        if (error) throw error;
        await supabase.from("audit_log").insert({ user_id: user.id, action: "INSERT", table_name: "tasks", record_id: data.id, new_values: payload });
        toast.success("Task berhasil ditambahkan!");
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{task ? "Edit Task" : "Tambah Task Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Judul task" required />
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={(v) => set("project_id", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Deskripsi task..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Medium</Label>
              <Select value={form.medium} onValueChange={(v) => set("medium", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="reels">Reels</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pillar</Label>
              <Input value={form.pillar} onChange={(e) => set("pillar", e.target.value)} placeholder="Content pillar" />
            </div>
            <div className="space-y-2">
              <Label>Emotional Angle</Label>
              <Input value={form.emotional_angle} onChange={(e) => set("emotional_angle", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="revision">Revision</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Approval Status</Label>
              <Select value={form.approval_status} onValueChange={(v) => set("approval_status", v)} disabled={!isAdminOrAbove}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {APPROVAL_STEPS.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              {!isAdminOrAbove && <p className="text-xs text-muted-foreground">Hanya admin yang bisa mengubah approval status</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Lead</Label>
              <Select value={form.assigned_pl} onValueChange={(v) => set("assigned_pl", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>{members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Editor</Label>
              <Select value={form.assigned_editor} onValueChange={(v) => set("assigned_editor", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>{members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Videographer</Label>
              <Select value={form.assigned_videographer} onValueChange={(v) => set("assigned_videographer", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>{members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Copywriter</Label>
              <Select value={form.assigned_copywriter} onValueChange={(v) => set("assigned_copywriter", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                <SelectContent>{members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Brief</Label>
            <Textarea value={form.brief} onChange={(e) => set("brief", e.target.value)} placeholder="Brief konten..." />
          </div>
          <div className="space-y-2">
            <Label>Script</Label>
            <Textarea value={form.script} onChange={(e) => set("script", e.target.value)} placeholder="Script..." />
          </div>
          <div className="space-y-2">
            <Label>Caption</Label>
            <Textarea value={form.caption} onChange={(e) => set("caption", e.target.value)} placeholder="Caption..." />
          </div>
          <div className="space-y-2">
            <Label>Reference URL</Label>
            <Input value={form.reference_url} onChange={(e) => set("reference_url", e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{task ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
