import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil } from "lucide-react";
import TeamMemberDialog from "@/components/dialogs/TeamMemberDialog";

export default function Team() {
  const { isSuperAdmin } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);

  const fetchMembers = () => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMembers(data);
    });
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = members.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.employee_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Team Management</h1>
          <p className="text-muted-foreground">Kelola anggota tim</p>
        </div>
      </div>

      <Card className="glass">
        <div className="p-4 pb-0">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari anggota..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <CardContent className="p-0 pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EMP ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                {isSuperAdmin && <TableHead className="text-right">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Belum ada anggota tim</TableCell></TableRow>
              ) : filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.employee_id || "-"}</TableCell>
                  <TableCell className="font-medium">{m.full_name}</TableCell>
                  <TableCell>{m.department || "-"}</TableCell>
                  <TableCell className="text-xs">{m.phone || "-"}</TableCell>
                  <TableCell className="text-xs">{m.join_date || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={m.status === "active" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditMember(m); setDialogOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TeamMemberDialog open={dialogOpen} onOpenChange={setDialogOpen} member={editMember} onSuccess={fetchMembers} />
    </div>
  );
}
