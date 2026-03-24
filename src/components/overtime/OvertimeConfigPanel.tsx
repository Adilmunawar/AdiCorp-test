import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OvertimeConfigPanel() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    regular_multiplier: 1.5, weekend_multiplier: 2.0, holiday_multiplier: 2.5,
    max_daily_hours: 4, max_monthly_hours: 40, requires_approval: true,
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["overtime-config", userProfile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("overtime_config").select("*").eq("company_id", userProfile!.company_id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  useEffect(() => {
    if (existing) {
      setConfig({
        regular_multiplier: Number(existing.regular_multiplier),
        weekend_multiplier: Number(existing.weekend_multiplier),
        holiday_multiplier: Number(existing.holiday_multiplier),
        max_daily_hours: existing.max_daily_hours,
        max_monthly_hours: existing.max_monthly_hours,
        requires_approval: existing.requires_approval,
      });
    }
  }, [existing]);

  const handleSave = async () => {
    try {
      const payload = { company_id: userProfile!.company_id!, ...config, updated_at: new Date().toISOString() };
      const { error } = existing
        ? await supabase.from("overtime_config").update(payload).eq("company_id", userProfile!.company_id!)
        : await supabase.from("overtime_config").insert(payload);
      if (error) throw error;
      toast({ title: "Overtime configuration saved" });
      queryClient.invalidateQueries({ queryKey: ["overtime-config"] });
    } catch (error: any) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Overtime Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">Tune multipliers and limits to keep overtime policies consistent and auditable.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading configuration...</div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>Regular Multiplier</Label><Input className="rounded-xl" type="number" step="0.1" value={config.regular_multiplier} onChange={(e) => setConfig({...config, regular_multiplier: Number(e.target.value)})} /></div>
          <div><Label>Weekend Multiplier</Label><Input className="rounded-xl" type="number" step="0.1" value={config.weekend_multiplier} onChange={(e) => setConfig({...config, weekend_multiplier: Number(e.target.value)})} /></div>
          <div><Label>Holiday Multiplier</Label><Input className="rounded-xl" type="number" step="0.1" value={config.holiday_multiplier} onChange={(e) => setConfig({...config, holiday_multiplier: Number(e.target.value)})} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Max Daily Hours</Label><Input className="rounded-xl" type="number" value={config.max_daily_hours} onChange={(e) => setConfig({...config, max_daily_hours: Number(e.target.value)})} /></div>
          <div><Label>Max Monthly Hours</Label><Input className="rounded-xl" type="number" value={config.max_monthly_hours} onChange={(e) => setConfig({...config, max_monthly_hours: Number(e.target.value)})} /></div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={config.requires_approval} onCheckedChange={(v) => setConfig({...config, requires_approval: v})} />
          <Label>Requires Approval</Label>
        </div>
        <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Save Configuration</Button>
      </CardContent>
    </Card>
  );
}
