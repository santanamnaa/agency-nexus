import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, Briefcase, ListTodo, DollarSign,
  UserCircle, Package, Clock, Bell, Settings, LogOut, FileText, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", roles: ["super_admin", "admin", "employee"] },
  { label: "Clients", icon: Briefcase, href: "/clients", roles: ["super_admin", "admin", "employee"] },
  { label: "Projects", icon: ListTodo, href: "/projects", roles: ["super_admin", "employee"] },
  { label: "Tasks", icon: FileText, href: "/tasks", roles: ["super_admin", "employee"] },
  { label: "Keuangan", icon: DollarSign, href: "/finance", roles: ["super_admin", "admin"] },
  { label: "Team", icon: Users, href: "/team", roles: ["super_admin"] },
  { label: "Services", icon: Package, href: "/services", roles: ["super_admin"] },
  { label: "Absensi", icon: Clock, href: "/attendance", roles: ["super_admin", "admin", "employee"] },
  { label: "Audit Log", icon: Activity, href: "/audit-log", roles: ["super_admin"] },
  { label: "Notifikasi", icon: Bell, href: "/notifications", roles: ["super_admin", "admin", "employee"] },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { role, profile, signOut } = useAuth();

  const filteredNav = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 py-5">
        <h1 className="text-2xl font-bold font-display text-gradient">HLM</h1>
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-semibold mt-1">ERP</span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} to={item.href}>
                <div className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4 space-y-3">
        <Link to="/settings">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </Link>
        <div className="flex items-center gap-3 px-3">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {profile?.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{role?.replace("_", " ")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} className="shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
