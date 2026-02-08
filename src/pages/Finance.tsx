import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Plus } from "lucide-react";

export default function Finance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Keuangan</h1>
          <p className="text-muted-foreground">Laporan keuangan lengkap</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Transaksi</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Pendapatan", value: "Rp 0", icon: TrendingUp, color: "text-success" },
          { label: "Total Beban", value: "Rp 0", icon: TrendingDown, color: "text-destructive" },
          { label: "Laba Bersih", value: "Rp 0", icon: DollarSign, color: "text-primary" },
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
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Beban</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada transaksi</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="neraca">
          <Card className="glass"><CardContent className="p-6 text-center text-muted-foreground py-12">Neraca akan ditampilkan di sini</CardContent></Card>
        </TabsContent>
        <TabsContent value="arus-kas">
          <Card className="glass"><CardContent className="p-6 text-center text-muted-foreground py-12">Arus Kas akan ditampilkan di sini</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
