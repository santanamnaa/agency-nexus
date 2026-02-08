import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("audit_log").select("*, profiles:user_id(full_name)").order("created_at", { ascending: false }).limit(100).then(({ data }) => {
      if (data) setLogs(data);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Audit Log</h1>
        <p className="text-muted-foreground">Riwayat semua perubahan data</p>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Record</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada log</TableCell></TableRow>
              ) : logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs">{new Date(l.created_at).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="font-medium">{l.profiles?.full_name || "-"}</TableCell>
                  <TableCell><Badge variant="outline">{l.action}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{l.table_name}</TableCell>
                  <TableCell className="font-mono text-xs">{l.record_id || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
