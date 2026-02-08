import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Briefcase, Users, Clock, FileText } from "lucide-react";

const kpiCards = [
  { label: "Total Revenue", value: "Rp 0", icon: DollarSign, change: "+0%" },
  { label: "Active Projects", value: "0", icon: Briefcase, change: "+0" },
  { label: "Active Clients", value: "0", icon: Users, change: "+0" },
  { label: "Hadir Hari Ini", value: "0", icon: Clock, change: "0%" },
  { label: "Total Content", value: "0", icon: FileText, change: "+0" },
];

const COLORS = ["hsl(263,70%,58%)", "hsl(330,81%,60%)", "hsl(198,93%,60%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)"];

const mockRevenue = [
  { month: "Jan", revenue: 0 }, { month: "Feb", revenue: 0 }, { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 }, { month: "May", revenue: 0 }, { month: "Jun", revenue: 0 },
];

const mockStatus = [
  { name: "Briefing", value: 0 }, { name: "In Production", value: 0 },
  { name: "Review", value: 0 }, { name: "Completed", value: 0 },
];

export default function Dashboard() {
  const { profile, role } = useAuth();

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
                  <p className="text-xs text-success mt-1">{kpi.change}</p>
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
              <BarChart data={mockRevenue}>
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
                <Pie data={mockStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {mockStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {mockStatus.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
