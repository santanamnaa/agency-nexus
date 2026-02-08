import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setNotifications(data);
    });
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Notifikasi</h1>
        <p className="text-muted-foreground">Semua notifikasi & update</p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="glass"><CardContent className="p-6 text-center text-muted-foreground py-12"><Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />Belum ada notifikasi</CardContent></Card>
        ) : notifications.map((n) => (
          <Card key={n.id} className={`glass ${!n.read ? "border-primary/30" : ""}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`h-2 w-2 rounded-full mt-2 ${!n.read ? "bg-primary" : "bg-muted"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString("id-ID")}</p>
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}><Check className="h-4 w-4" /></Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
