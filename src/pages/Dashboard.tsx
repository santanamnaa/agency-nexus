import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Briefcase, Users, Clock, FileText } from "lucide-react";

const COLORS = ["hsl(263,70%,58%)", "hsl(330,81%,60%)", "hsl(198,93%,60%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)"];

export default function Dashboard() {
  const { profile, role } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, activeProjects: 0, activeClients: 0, todayAttendance: 0, totalTasks: 0 });
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [txRes, projRes, clientRes, attRes, taskRes] = await Promise.all([
        supabase.from("finance_transactions").select("income, expense, transaction_date"),
        supabase.from("projects").select("status"),
        supabase.from("clients").select("status"),
        supabase.from("attendance").select("id").eq("date", today),
        supabase.from("tasks").select("status"),
      ]);

      const transactions = txRes.data || [];
      const projects = projRes.data || [];
      const clients = clientRes.data || [];
      const tasks = taskRes.data || [];

      const totalRevenue = transactions.reduce((s, t) => s + (t.income || 0) - (t.expense || 0), 0);
      const activeProjects = projects.filter((p) => !["completed", "delivered"].includes(p.status)).length;
      const activeClients = clients.filter((c) => c.status === "active").length;

      setStats({
        revenue: totalRevenue,
        activeProjects,
        activeClients,
        todayAttendance: attRes.data?.length || 0,
        totalTasks: tasks.length,
      });

      // Monthly revenue for current year
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const year = new Date().getFullYear();
      const monthlyRevenue = months.map((m, i) => {
        const monthTx = transactions.filter((t) => {
          const d = new Date(t.transaction_date);
          return d.getFullYear() === year && d.getMonth() === i;
        });
        return { month: m, revenue: monthTx.reduce((s, t) => s + (t.income || 0), 0) };
      });
      setRevenueData(monthlyRevenue);

      // Project status distribution
      const statusCount: Record<string, number> = {};
      projects.forEach((p) => { statusCount[p.status] = (statusCount[p.status] || 0) + 1; });
      setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
    };

    fetchDashboard();
  }, []);

  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const kpiCards = [
    { label: "Total Revenue", value: fmt(stats.revenue), icon: DollarSign, change: "" },
    { label: "Active Projects", value: String(stats.activeProjects), icon: Briefcase, change: "" },
    { label: "Active Clients", value: String(stats.activeClients), icon: Users, change: "" },
    { label: "Hadir Hari Ini", value: String(stats.todayAttendance), icon: Clock, change: "" },
    { label: "Total Tasks", value: String(stats.totalTasks), icon: FileText, change: "" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {profile?.full_name || "User"} 👋</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="glass hover:shadow-glow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold font-display mt-1">{kpi.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <kpi.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass">
          <CardHeader>
            <CardTitle className="font-display text-lg">Revenue Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-display text-lg">Production Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData.length > 0 ? statusData : [{ name: "No data", value: 1 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {(statusData.length > 0 ? statusData : [{ name: "No data" }]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground capitalize">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
