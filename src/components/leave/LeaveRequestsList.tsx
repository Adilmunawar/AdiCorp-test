import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, CalendarDays, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LeaveRequestsList() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = userProfile?.is_admin;
  const [statusFilter, setStatusFilter] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["leave-requests", userProfile?.company_id, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("leave_requests")
        .select("*, employees(name), leave_types(name, type)")
        .eq("company_id", userProfile!.company_id!)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "pending" | "approved" | "rejected" | "cancelled");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      setActingId(id);
      const { error } = await supabase
        .from("leave_requests")
        .update({ status, reviewed_by: userProfile!.id, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `Leave request ${status}` });
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
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
    cancelled: "outline",
  };

  const pendingCount = useMemo(() => {
    return (requests || []).filter((request: any) => request.status === "pending").length;
  }, [requests]);

  if (!userProfile?.company_id) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="py-8 text-center text-muted-foreground">
          Complete company setup to manage leave requests.
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Leave Requests
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Total: {requests?.length || 0}</Badge>
            <Badge variant="secondary">Pending: {pendingCount}</Badge>
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests?.map((req: any) => (
            <div key={req.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{req.employees?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {req.leave_types?.name} • {format(new Date(req.start_date), "MMM dd")} - {format(new Date(req.end_date), "MMM dd, yyyy")} • {req.days_count} day(s)
                  </p>
                  {req.reason && <p className="text-xs text-muted-foreground mt-1">{req.reason}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Badge variant={statusVariant[req.status] || "outline"} className="capitalize">
                  {req.status}
                </Badge>
                {isAdmin && req.status === "pending" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="default" disabled={actingId === req.id} onClick={() => handleAction(req.id, "approved")}>
                      {actingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="destructive" disabled={actingId === req.id} onClick={() => handleAction(req.id, "rejected")}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!requests || requests.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No leave requests found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
