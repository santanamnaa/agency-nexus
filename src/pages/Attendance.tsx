import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  hadir: "bg-success/20 text-success",
  wfh: "bg-chart-3/20 text-chart-3",
  sakit: "bg-warning/20 text-warning",
  cuti: "bg-primary/20 text-primary",
  izin: "bg-accent/20 text-accent",
  alpa: "bg-destructive/20 text-destructive",
};

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);

  const fetchRecords = async () => {
    const { data } = await supabase.from("attendance").select("*, profiles(full_name)").order("date", { ascending: false }).limit(50);
    if (data) setRecords(data);

    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const { data: todayData } = await supabase.from("attendance").select("*").eq("user_id", user.id).eq("date", today).single();
      setTodayRecord(todayData);
    }
  };

  useEffect(() => { fetchRecords(); }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("attendance").insert({ user_id: user.id, date: today, check_in: new Date().toISOString(), status: "hadir" });
    if (error) { toast.error("Gagal check-in"); return; }
    toast.success("Check-in berhasil!");
    fetchRecords();
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    const { error } = await supabase.from("attendance").update({ check_out: new Date().toISOString() }).eq("id", todayRecord.id);
    if (error) { toast.error("Gagal check-out"); return; }
    toast.success("Check-out berhasil!");
    fetchRecords();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Absensi</h1>
          <p className="text-muted-foreground">Check-in & monitoring kehadiran</p>
        </div>
        <div className="flex gap-2">
          {!todayRecord ? (
            <Button onClick={handleCheckIn} className="gradient-primary text-primary-foreground"><LogIn className="h-4 w-4 mr-2" />Check In</Button>
          ) : !todayRecord.check_out ? (
            <Button onClick={handleCheckOut} variant="outline"><LogOut className="h-4 w-4 mr-2" />Check Out</Button>
          ) : (
            <Badge className="bg-success/20 text-success px-4 py-2">✓ Sudah check-in & check-out</Badge>
          )}
        </div>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="font-display text-lg">Riwayat Absensi</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada data absensi</TableCell></TableRow>
              ) : records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">{r.date}</TableCell>
                  <TableCell className="font-medium">{r.profiles?.full_name || "-"}</TableCell>
                  <TableCell className="text-xs">{r.check_in ? new Date(r.check_in).toLocaleTimeString("id-ID") : "-"}</TableCell>
                  <TableCell className="text-xs">{r.check_out ? new Date(r.check_out).toLocaleTimeString("id-ID") : "-"}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[r.status] || ""}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
