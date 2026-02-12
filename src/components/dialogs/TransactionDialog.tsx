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
  transaction?: any;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Pendapatan Jasa", "Pendapatan Retainer", "Pendapatan Lainnya",
  "Beban Talent", "Beban Produksi", "Beban Equipment", "Beban Software",
  "Beban Operasional", "Beban Marketing", "Beban Lainnya",
];

export default function TransactionDialog({ open, onOpenChange, transaction, onSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    transaction_no: "", transaction_date: new Date().toISOString().split("T")[0],
    category: "", description: "", income: 0, expense: 0, client_id: "", project_id: "",
  });

  useEffect(() => {
    if (open) {
      supabase.from("clients").select("id, brand_name").then(({ data }) => data && setClients(data));
      supabase.from("projects").select("id, name").then(({ data }) => data && setProjects(data));
    }
  }, [open]);

  useEffect(() => {
    if (transaction) {
      setForm({
        transaction_no: transaction.transaction_no || "", transaction_date: transaction.transaction_date || "",
        category: transaction.category || "", description: transaction.description || "",
        income: transaction.income || 0, expense: transaction.expense || 0,
        client_id: transaction.client_id || "", project_id: transaction.project_id || "",
      });
    } else {
      setForm({ transaction_no: "", transaction_date: new Date().toISOString().split("T")[0], category: "", description: "", income: 0, expense: 0, client_id: "", project_id: "" });
    }
  }, [transaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const payload = { ...form, created_by: user.id, client_id: form.client_id || null, project_id: form.project_id || null };
      if (transaction) {
        const { error } = await supabase.from("finance_transactions").update(payload).eq("id", transaction.id);
        if (error) throw error;
        toast.success("Transaksi berhasil diupdate!");
      } else {
        const { error } = await supabase.from("finance_transactions").insert(payload);
        if (error) throw error;
        toast.success("Transaksi berhasil ditambahkan!");
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
          <DialogTitle className="font-display">{transaction ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>No Transaksi</Label>
              <Input value={form.transaction_no} onChange={(e) => set("transaction_no", e.target.value)} placeholder="TRX-001" required />
            </div>
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input type="date" value={form.transaction_date} onChange={(e) => set("transaction_date", e.target.value)} required />
            </div>
          </div>
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
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Deskripsi transaksi..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pendapatan (IDR)</Label>
              <Input type="number" value={form.income} onChange={(e) => set("income", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Beban (IDR)</Label>
              <Input type="number" value={form.expense} onChange={(e) => set("expense", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger><SelectValue placeholder="Opsional" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.brand_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={(v) => set("project_id", v)}>
                <SelectTrigger><SelectValue placeholder="Opsional" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{transaction ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
