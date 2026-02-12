import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Plus, Pencil, Trash2 } from "lucide-react";
import TransactionDialog from "@/components/dialogs/TransactionDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

export default function Finance() {
  const { isSuperAdmin, user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balanceSheet, setBalanceSheet] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchData = async () => {
    const [txRes, bsRes] = await Promise.all([
      supabase.from("finance_transactions").select("*, clients(brand_name), projects(name)").order("transaction_date", { ascending: false }),
      supabase.from("balance_sheet").select("*").order("category"),
    ]);
    if (txRes.data) setTransactions(txRes.data);
    if (bsRes.data) setBalanceSheet(bsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const totalIncome = transactions.reduce((s, t) => s + (t.income || 0), 0);
  const totalExpense = transactions.reduce((s, t) => s + (t.expense || 0), 0);
  const netProfit = totalIncome - totalExpense;

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    const { error } = await supabase.from("finance_transactions").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal menghapus transaksi"); return; }
    toast.success("Transaksi berhasil dihapus");
    setDeleteTarget(null);
    fetchData();
  };

  // Cash flow derived from transactions
  const operasional = transactions.filter((t) => !t.category?.includes("Investasi") && !t.category?.includes("Pendanaan"));
  const cashOperasional = operasional.reduce((s, t) => s + (t.income || 0) - (t.expense || 0), 0);

  // Balance sheet grouping
  const bsGrouped = balanceSheet.reduce((acc: Record<string, any[]>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Keuangan</h1>
          <p className="text-muted-foreground">Laporan keuangan lengkap — Hanya Super Admin</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => { setEditTx(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Tambah Transaksi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Pendapatan", value: fmt(totalIncome), icon: TrendingUp, color: "text-success" },
          { label: "Total Beban", value: fmt(totalExpense), icon: TrendingDown, color: "text-destructive" },
          { label: "Laba Bersih", value: fmt(netProfit), icon: DollarSign, color: netProfit >= 0 ? "text-success" : "text-destructive" },
        ].map((item) => (
          <Card key={item.label} className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold font-display">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="laba-rugi">
        <TabsList className="bg-secondary">
          <TabsTrigger value="laba-rugi">Laba Rugi</TabsTrigger>
          <TabsTrigger value="neraca">Neraca</TabsTrigger>
          <TabsTrigger value="arus-kas">Arus Kas</TabsTrigger>
        </TabsList>

        <TabsContent value="laba-rugi">
          <Card className="glass">
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No Transaksi</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Beban</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Belum ada transaksi</TableCell></TableRow>
                  ) : transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs">{t.transaction_date}</TableCell>
                      <TableCell className="font-mono text-xs">{t.transaction_no}</TableCell>
                      <TableCell className="text-xs">{t.clients?.brand_name || "-"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{t.category}</Badge></TableCell>
                      <TableCell className="text-xs">{t.description || "-"}</TableCell>
                      <TableCell className="text-right text-success font-medium">{t.income ? fmt(t.income) : "-"}</TableCell>
                      <TableCell className="text-right text-destructive font-medium">{t.expense ? fmt(t.expense) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditTx(t); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          {isSuperAdmin && <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(t)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactions.length > 0 && (
                    <TableRow className="font-bold border-t-2">
                      <TableCell colSpan={5} className="text-right">TOTAL</TableCell>
                      <TableCell className="text-right text-success">{fmt(totalIncome)}</TableCell>
                      <TableCell className="text-right text-destructive">{fmt(totalExpense)}</TableCell>
                      <TableCell className="text-right">{fmt(netProfit)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neraca">
          <Card className="glass">
            <CardContent className="p-6">
              {Object.keys(bsGrouped).length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Belum ada data neraca. Tambahkan item melalui database.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(bsGrouped).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-display font-semibold text-sm mb-2 uppercase text-muted-foreground">{category}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Sub Kategori</TableHead>
                            <TableHead>Periode</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(items as any[]).map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.item_name}</TableCell>
                              <TableCell className="text-xs">{item.sub_category || "-"}</TableCell>
                              <TableCell className="text-xs">{item.period}</TableCell>
                              <TableCell className="text-right font-medium">{fmt(item.amount || 0)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-bold border-t">
                            <TableCell colSpan={3} className="text-right">Total {category}</TableCell>
                            <TableCell className="text-right">{fmt((items as any[]).reduce((s, i) => s + (i.amount || 0), 0))}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arus-kas">
          <Card className="glass">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-display font-semibold text-sm mb-3 uppercase text-muted-foreground">Arus Kas dari Operasi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm">Total Pendapatan Operasional</span>
                    <span className="font-medium text-success">{fmt(totalIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm">Total Beban Operasional</span>
                    <span className="font-medium text-destructive">({fmt(totalExpense)})</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Kas Bersih dari Operasi</span>
                    <span className={cashOperasional >= 0 ? "text-success" : "text-destructive"}>{fmt(cashOperasional)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm mb-3 uppercase text-muted-foreground">Arus Kas dari Investasi</h3>
                <div className="flex justify-between py-2 text-muted-foreground">
                  <span className="text-sm">Belum ada transaksi investasi</span>
                  <span className="font-medium">Rp 0</span>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm mb-3 uppercase text-muted-foreground">Arus Kas dari Pendanaan</h3>
                <div className="flex justify-between py-2 text-muted-foreground">
                  <span className="text-sm">Belum ada transaksi pendanaan</span>
                  <span className="font-medium">Rp 0</span>
                </div>
              </div>

              <div className="border-t-2 border-border pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span className="font-display">Kenaikan/(Penurunan) Kas Bersih</span>
                  <span className={cashOperasional >= 0 ? "text-success" : "text-destructive"}>{fmt(cashOperasional)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editTx} onSuccess={fetchData} />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Hapus Transaksi?" description={`Yakin ingin menghapus "${deleteTarget?.transaction_no}"?`} onConfirm={handleDelete} />
    </div>
  );
}
