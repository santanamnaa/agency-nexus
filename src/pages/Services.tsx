import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

const tierColors: Record<string, string> = {
  essentials: "bg-chart-3/20 text-chart-3",
  signature: "bg-primary/20 text-primary",
  prime: "bg-accent/20 text-accent",
};

export default function Services() {
  const { isSuperAdmin, user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchServices = () => {
    supabase.from("services").select("*").order("category").then(({ data }) => {
      if (data) setServices(data);
    });
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    const { error } = await supabase.from("services").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal menghapus service"); return; }
    toast.success("Service berhasil dihapus");
    setDeleteTarget(null);
    fetchServices();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Service Catalog</h1>
          <p className="text-muted-foreground">Katalog layanan & pricing</p>
        </div>
        {isSuperAdmin && (
          <Button className="gradient-primary text-primary-foreground" onClick={() => { setEditService(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />Tambah Service
          </Button>
        )}
      </div>

      {services.length === 0 ? (
        <Card className="glass"><CardContent className="p-6 text-center text-muted-foreground py-12">Belum ada service catalog</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="glass hover:shadow-glow transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display">{s.name}</CardTitle>
                  <Badge className={tierColors[s.tier] || ""}>{s.tier}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold font-display">Rp {(s.price || 0).toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-1">HPP: Rp {(s.hpp || 0).toLocaleString("id-ID")}</p>
                {s.description && <p className="text-xs text-muted-foreground mt-2">{s.description}</p>}
                {isSuperAdmin && (
                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => { setEditService(s); setDialogOpen(true); }}><Pencil className="h-3 w-3 mr-1" />Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(s)}><Trash2 className="h-3 w-3 mr-1 text-destructive" />Hapus</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} service={editService} onSuccess={fetchServices} />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Hapus Service?" description={`Yakin ingin menghapus "${deleteTarget?.name}"?`} onConfirm={handleDelete} />
    </div>
  );
}
