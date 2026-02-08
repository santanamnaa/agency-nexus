import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";

const tierColors: Record<string, string> = {
  essentials: "bg-chart-3/20 text-chart-3",
  signature: "bg-primary/20 text-primary",
  prime: "bg-accent/20 text-accent",
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("category").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Service Catalog</h1>
          <p className="text-muted-foreground">Katalog layanan & pricing</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Tambah Service</Button>
      </div>

      {services.length === 0 ? (
        <Card className="glass"><CardContent className="p-6 text-center text-muted-foreground py-12">Belum ada service catalog</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="glass hover:shadow-glow transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display">{s.name}</CardTitle>
                  <Badge className={tierColors[s.tier] || ""}>{s.tier}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold font-display">Rp {(s.price || 0).toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-1">HPP: Rp {(s.hpp || 0).toLocaleString("id-ID")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
