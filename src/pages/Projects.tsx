import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, LayoutGrid, List } from "lucide-react";

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
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");

  useEffect(() => {
    supabase.from("projects").select("*, clients(brand_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setProjects(data);
    });
  }, []);

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
          <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Project</Button>
        </div>
      </div>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada project</TableCell></TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.project_id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.clients?.brand_name || "-"}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Progress value={p.progress || 0} className="w-20 h-2" /><span className="text-xs text-muted-foreground">{p.progress || 0}%</span></div></TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[p.status] || ""}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
