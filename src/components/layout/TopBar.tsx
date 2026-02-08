import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  const { theme, toggle } = useTheme();
  const { role } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3 bg-card/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari client, project, task..." className="pl-10 bg-secondary/50 border-0" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
