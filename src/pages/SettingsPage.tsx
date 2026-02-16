import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { profile, role, user } = useAuth();
  const { theme, toggle } = useTheme();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Profil berhasil diupdate!");
    setSaving(false);
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) { toast.error("Password minimal 6 karakter"); return; }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password berhasil diubah!"); setOldPassword(""); setNewPassword(""); }
    setChangingPw(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Pengaturan akun & preferensi</p>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="font-display text-lg">Profil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{role?.replace("_", " ")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <Button onClick={saveProfile} className="gradient-primary text-primary-foreground" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Simpan Profil
          </Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="font-display text-lg">Ubah Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" />
          </div>
          <Button onClick={changePassword} variant="outline" disabled={changingPw}>
            {changingPw && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Ubah Password
          </Button>
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
