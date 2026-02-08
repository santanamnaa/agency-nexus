import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

const approvalColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  "pl review": "bg-chart-5/20 text-chart-5",
  "ad review": "bg-chart-3/20 text-chart-3",
  "pm review": "bg-primary/20 text-primary",
  "client review": "bg-accent/20 text-accent",
  final: "bg-success/20 text-success",
  published: "bg-success/20 text-success",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("tasks").select("*, projects(name, project_id)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setTasks(data);
    });
  }, []);

  const filtered = tasks.filter((t) => t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Production Tasks</h1>
          <p className="text-muted-foreground">Content workflow & approval system</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Task</Button>
      </div>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada task</TableCell></TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-xs">{t.projects?.name || "-"}</TableCell>
                  <TableCell>{t.medium || "-"}</TableCell>
                  <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={approvalColors[t.approval_status] || ""}>{t.approval_status}</Badge></TableCell>
                  <TableCell className="text-xs">{t.due_date || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
