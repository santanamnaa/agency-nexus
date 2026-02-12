import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, CheckCircle, ArrowRight } from "lucide-react";
import TaskDialog from "@/components/dialogs/TaskDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

const approvalColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  "pl review": "bg-chart-5/20 text-chart-5",
  "ad review": "bg-chart-3/20 text-chart-3",
  "pm review": "bg-primary/20 text-primary",
  "client review": "bg-accent/20 text-accent",
  final: "bg-success/20 text-success",
  published: "bg-success/20 text-success",
};

const APPROVAL_FLOW = ["draft", "pl review", "ad review", "pm review", "client review", "final", "published"];

export default function Tasks() {
  const { isSuperAdmin, isAdminOrAbove, user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchTasks = () => {
    supabase.from("tasks").select("*, projects(name, project_id)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setTasks(data);
    });
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    const { error } = await supabase.from("tasks").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal menghapus task"); return; }
    await supabase.from("audit_log").insert({ user_id: user.id, action: "DELETE", table_name: "tasks", record_id: deleteTarget.id, old_values: deleteTarget });
    toast.success("Task berhasil dihapus");
    setDeleteTarget(null);
    fetchTasks();
  };

  const advanceApproval = async (task: any) => {
    const currentIdx = APPROVAL_FLOW.indexOf(task.approval_status);
    if (currentIdx < 0 || currentIdx >= APPROVAL_FLOW.length - 1) return;
    const nextStatus = APPROVAL_FLOW[currentIdx + 1];
    const { error } = await supabase.from("tasks").update({ approval_status: nextStatus }).eq("id", task.id);
    if (error) { toast.error("Gagal update approval"); return; }
    await supabase.from("audit_log").insert({
      user_id: user!.id, action: "APPROVE", table_name: "tasks", record_id: task.id,
      old_values: { approval_status: task.approval_status }, new_values: { approval_status: nextStatus },
    });
    toast.success(`Approval: ${task.approval_status} → ${nextStatus}`);
    fetchTasks();
  };

  const filtered = tasks.filter((t) => t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Production Tasks</h1>
          <p className="text-muted-foreground">Content workflow & approval system</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => { setEditTask(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Tambah Task
        </Button>
      </div>

      {/* Approval Flow Visual */}
      <Card className="glass">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Approval Flow</p>
          <div className="flex items-center gap-1 flex-wrap">
            {APPROVAL_FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <Badge variant="outline" className={`${approvalColors[step]} text-xs`}>{step}</Badge>
                {i < APPROVAL_FLOW.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari task..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Belum ada task</TableCell></TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-xs">{t.projects?.name || "-"}</TableCell>
                  <TableCell>{t.medium || "-"}</TableCell>
                  <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={approvalColors[t.approval_status] || ""}>{t.approval_status}</Badge></TableCell>
                  <TableCell className="text-xs">{t.due_date || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {isAdminOrAbove && t.approval_status !== "published" && (
                        <Button variant="ghost" size="icon" onClick={() => advanceApproval(t)} title="Approve ke tahap berikutnya">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => { setEditTask(t); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      {isSuperAdmin && <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(t)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editTask} onSuccess={fetchTasks} />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Hapus Task?" description={`Yakin ingin menghapus "${deleteTarget?.title}"?`} onConfirm={handleDelete} />
    </div>
  );
}
