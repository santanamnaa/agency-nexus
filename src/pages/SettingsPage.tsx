import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { profile, role, user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Pengaturan akun & preferensi</p>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="font-display text-lg">Profil</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-medium text-lg">{profile?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{role?.replace("_", " ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="font-display text-lg">Tampilan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <Button variant="outline" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
