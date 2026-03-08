import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaveBalanceOverview() {
  const { userProfile } = useAuth();
  const currentYear = new Date().getFullYear();

  const { data: balances, isLoading } = useQuery({
    queryKey: ["leave-balances", userProfile?.company_id, currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_balances")
        .select("*, employees(name), leave_types(name)")
        .eq("year", currentYear);
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}</div>;
  }

  // Group by employee
  const grouped = (balances || []).reduce((acc: Record<string, any[]>, b: any) => {
    const name = b.employees?.name || "Unknown";
    if (!acc[name]) acc[name] = [];
    acc[name].push(b);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Leave Balances - {currentYear}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No leave balances found. Configure leave types and initialize balances first.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([name, items]) => (
              <div key={name} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{name}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(items as any[]).map((b: any) => {
                    const used = Number(b.used_days);
                    const total = Number(b.total_days);
                    const remaining = total - used;
                    const pct = total > 0 ? (used / total) * 100 : 0;
                    return (
                      <div key={b.id} className="p-3 rounded-lg bg-card border border-border">
                        <p className="text-sm font-medium text-foreground">{b.leave_types?.name || "Unknown"}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-lg font-bold text-primary">{remaining}</span>
                          <span className="text-xs text-muted-foreground">/ {total} remaining</span>
                        </div>
                        <Progress value={pct} className="mt-2 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">{used} used</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
