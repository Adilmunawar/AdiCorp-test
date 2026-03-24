import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";

export default function OvertimeRecordsList() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const queryClient = useQueryClient();
  const isAdmin = userProfile?.is_admin;
  const [statusFilter, setStatusFilter] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: records, isLoading } = useQuery({
    queryKey: ["overtime-records", userProfile?.company_id, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("overtime_records")
        .select("*, employees(name)")
        .eq("company_id", userProfile!.company_id!)
        .order("date", { ascending: false });
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  const handleAction = async (id: string, status: string) => {
    try {
      setActingId(id);
      const { error } = await supabase.from("overtime_records").update({ status, reviewed_by: userProfile!.id, reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      toast({ title: `Overtime ${status}` });
      queryClient.invalidateQueries({ queryKey: ["overtime-records"] });
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    } finally {
      setActingId(null);
    }
  };

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
  };

  const pendingCount = useMemo(() => (records || []).filter((rec: any) => rec.status === "pending").length, [records]);

  if (isLoading) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Overtime Records</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Total: {records?.length || 0}</Badge>
            <Badge variant="secondary">Pending: {pendingCount}</Badge>
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records?.map((rec: any) => (
            <div key={rec.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{rec.employees?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(rec.date), "MMM dd, yyyy")} • {rec.hours}h • {rec.overtime_type} • {rec.multiplier}x
                  </p>
                  <p className="text-sm font-medium text-primary">{currency} {Number(rec.total_amount).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Badge variant={statusVariant[rec.status] || "outline"} className="capitalize">{rec.status}</Badge>
                {isAdmin && rec.status === "pending" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="default" disabled={actingId === rec.id} onClick={() => handleAction(rec.id, "approved")}>
                      {actingId === rec.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="destructive" disabled={actingId === rec.id} onClick={() => handleAction(rec.id, "rejected")}><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!records || records.length === 0) && <p className="text-center text-muted-foreground py-8">No overtime records found</p>}
        </div>
      </CardContent>
    </Card>
  );
}
