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
  client?: any;
  onSuccess: () => void;
}

export default function ClientDialog({ open, onOpenChange, client, onSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_id: "",
    brand_name: "",
    pic_name: "",
    service_category: "",
    package: "",
    value_idr: 0,
    start_date: "",
    status: "lead",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setForm({
        client_id: client.client_id || "",
        brand_name: client.brand_name || "",
        pic_name: client.pic_name || "",
        service_category: client.service_category || "",
        package: client.package || "",
        value_idr: client.value_idr || 0,
        start_date: client.start_date || "",
        status: client.status || "lead",
        notes: client.notes || "",
      });
    } else {
      setForm({ client_id: "", brand_name: "", pic_name: "", service_category: "", package: "", value_idr: 0, start_date: "", status: "lead", notes: "" });
    }
  }, [client, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const payload = { ...form, created_by: user.id };
      if (client) {
        const { error } = await supabase.from("clients").update(payload).eq("id", client.id);
        if (error) throw error;
        await logAudit("UPDATE", "clients", client.id, client, payload);
        toast.success("Client berhasil diupdate!");
      } else {
        const { data, error } = await supabase.from("clients").insert(payload).select().single();
        if (error) throw error;
        await logAudit("INSERT", "clients", data.id, null, payload);
        toast.success("Client berhasil ditambahkan!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logAudit = async (action: string, table: string, recordId: string, oldVal: any, newVal: any) => {
    if (!user) return;
    await supabase.from("audit_log").insert({ user_id: user.id, action, table_name: table, record_id: recordId, old_values: oldVal, new_values: newVal });
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{client ? "Edit Client" : "Tambah Client Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input value={form.client_id} onChange={(e) => set("client_id", e.target.value)} placeholder="CLT-001" required />
            </div>
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} placeholder="Nama brand" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PIC Name</Label>
              <Input value={form.pic_name} onChange={(e) => set("pic_name", e.target.value)} placeholder="Nama PIC" />
            </div>
            <div className="space-y-2">
              <Label>Service Category</Label>
              <Select value={form.service_category} onValueChange={(v) => set("service_category", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="video_production">Video Production</SelectItem>
                  <SelectItem value="branding">Branding</SelectItem>
                  <SelectItem value="data_insight">Data Insight</SelectItem>
                  <SelectItem value="ip_development">IP Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Package</Label>
              <Select value={form.package || ""} onValueChange={(v) => set("package", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih package" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="essentials">Essentials</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                  <SelectItem value="prime">Prime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value (IDR)</Label>
              <Input type="number" value={form.value_idr} onChange={(e) => set("value_idr", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Catatan..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {client ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
