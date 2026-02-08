import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

const statusColors: Record<string, string> = {
  lead: "bg-chart-5/20 text-chart-5",
  proposal: "bg-chart-3/20 text-chart-3",
  active: "bg-success/20 text-success",
  completed: "bg-primary/20 text-primary",
  lost: "bg-destructive/20 text-destructive",
};

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    supabase.from("clients").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setClients(data);
    });
  }, []);

  const filtered = clients.filter((c) =>
    c.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Clients / CRM</h1>
          <p className="text-muted-foreground">Kelola database client & pipeline</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Client</Button>
      </div>

      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari client..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada data client</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.client_id}</TableCell>
                  <TableCell className="font-medium">{c.brand_name}</TableCell>
                  <TableCell>{c.pic_name}</TableCell>
                  <TableCell>{c.service_category}</TableCell>
                  <TableCell>Rp {(c.value_idr || 0).toLocaleString("id-ID")}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[c.status] || ""}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
