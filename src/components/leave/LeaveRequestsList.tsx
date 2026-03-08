import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LeaveRequestsList() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = userProfile?.is_admin;
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["leave-requests", userProfile?.company_id, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("leave_requests")
        .select("*, employees(name), leave_types(name, type)")
        .eq("company_id", userProfile!.company_id!)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({ status, reviewed_by: userProfile!.id, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `Leave request ${status}` });
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    approved: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-red-500/10 text-red-700 border-red-500/20",
    cancelled: "bg-muted text-muted-foreground border-border",
  };

  if (isLoading) {
    return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Leave Requests
        </CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
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
          {requests?.map((req: any) => (
            <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
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
              <div className="flex items-center gap-3">
                <Badge className={statusColors[req.status] || ""} variant="outline">
                  {req.status}
                </Badge>
                {isAdmin && req.status === "pending" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-500/10" onClick={() => handleAction(req.id, "approved")}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-500/10" onClick={() => handleAction(req.id, "rejected")}>
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
