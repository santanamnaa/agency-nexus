import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, LayoutGrid, List, Pencil, Trash2 } from "lucide-react";
import ProjectDialog from "@/components/dialogs/ProjectDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  briefing: "bg-chart-5/20 text-chart-5",
  planning: "bg-chart-3/20 text-chart-3",
  "in production": "bg-primary/20 text-primary",
  review: "bg-accent/20 text-accent",
  revision: "bg-warning/20 text-warning",
  delivered: "bg-success/20 text-success",
  completed: "bg-success/20 text-success",
};

export default function Projects() {
  const { isSuperAdmin, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchProjects = () => {
    supabase.from("projects").select("*, clients(brand_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setProjects(data);
    });
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal menghapus project"); return; }
    await supabase.from("audit_log").insert({ user_id: user.id, action: "DELETE", table_name: "projects", record_id: deleteTarget.id, old_values: deleteTarget });
    toast.success("Project berhasil dihapus");
    setDeleteTarget(null);
    fetchProjects();
  };

  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.project_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Project Production</h1>
          <p className="text-muted-foreground">Kelola semua project & produksi</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-secondary rounded-lg p-0.5">
            <Button variant={view === "table" ? "default" : "ghost"} size="sm" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
            <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" onClick={() => setView("kanban")}><LayoutGrid className="h-4 w-4" /></Button>
          </div>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { setEditProject(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />Tambah Project
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <Card className="glass">
          <CardHeader className="pb-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari project..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada project</TableCell></TableRow>
                ) : filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.project_id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.clients?.brand_name || "-"}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><Progress value={p.progress || 0} className="w-20 h-2" /><span className="text-xs text-muted-foreground">{p.progress || 0}%</span></div></TableCell>
                    <TableCell><Badge variant="outline" className={statusColors[p.status] || ""}>{p.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditProject(p); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        {isSuperAdmin && <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {["briefing", "in production", "review", "completed"].map((status) => (
            <div key={status} className="space-y-3">
              <h3 className="font-display font-semibold capitalize text-sm text-muted-foreground">{status}</h3>
              {filtered.filter((p) => p.status === status).map((p) => (
                <Card key={p.id} className="glass cursor-pointer hover:shadow-glow transition-all" onClick={() => { setEditProject(p); setDialogOpen(true); }}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.clients?.brand_name || "-"}</p>
                    <Progress value={p.progress || 0} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editProject} onSuccess={fetchProjects} />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Hapus Project?" description={`Yakin ingin menghapus "${deleteTarget?.name}"?`} onConfirm={handleDelete} />
    </div>
  );
}
