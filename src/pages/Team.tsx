import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMembers(data);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Team Management</h1>
          <p className="text-muted-foreground">Kelola anggota tim</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Anggota</Button>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EMP ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada anggota tim</TableCell></TableRow>
              ) : members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.employee_id || "-"}</TableCell>
                  <TableCell className="font-medium">{m.full_name}</TableCell>
                  <TableCell>{m.department || "-"}</TableCell>
                  <TableCell className="text-xs">{m.join_date || "-"}</TableCell>
                  <TableCell><Badge variant="outline" className={m.status === "active" ? "bg-success/20 text-success" : ""}>{m.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
