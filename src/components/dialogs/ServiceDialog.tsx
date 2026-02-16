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
  service?: any;
  onSuccess: () => void;
}

const CATEGORIES = ["Social Media Activation", "Data Insight", "IP Development", "Photo & Video Production"];

export default function ServiceDialog({ open, onOpenChange, service, onSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "", tier: "essentials", price: 0, hpp: 0, description: "", status: "active",
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || "", category: service.category || "", tier: service.tier || "essentials",
        price: service.price || 0, hpp: service.hpp || 0, description: service.description || "",
        status: service.status || "active",
      });
    } else {
      setForm({ name: "", category: "", tier: "essentials", price: 0, hpp: 0, description: "", status: "active" });
    }
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (service) {
        const { error } = await supabase.from("services").update(form).eq("id", service.id);
        if (error) throw error;
        toast.success("Service berhasil diupdate!");
      } else {
        const { error } = await supabase.from("services").insert(form);
        if (error) throw error;
        toast.success("Service berhasil ditambahkan!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{service ? "Edit Service" : "Tambah Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Service</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama layanan" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={form.tier} onValueChange={(v) => set("tier", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="essentials">Essentials</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                  <SelectItem value="prime">Prime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Harga (IDR)</Label>
              <Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>HPP (IDR)</Label>
              <Input type="number" value={form.hpp} onChange={(e) => set("hpp", Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Deskripsi layanan..." />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{service ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
