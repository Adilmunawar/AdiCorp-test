import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInBusinessDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface LeaveRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LeaveRequestForm({ open, onOpenChange }: LeaveRequestFormProps) {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open && userProfile?.company_id) {
      fetchData();
    }
  }, [open, userProfile?.company_id]);

  const fetchData = async () => {
    const [empRes, ltRes] = await Promise.all([
      supabase.from("employees").select("id, name").eq("company_id", userProfile!.company_id!).eq("status", "active").order("name"),
      supabase.from("leave_types").select("*").eq("company_id", userProfile!.company_id!).eq("is_active", true),
    ]);
    setEmployees(empRes.data || []);
    setLeaveTypes(ltRes.data || []);
  };

  const daysCount = startDate && endDate ? Math.max(1, differenceInBusinessDays(endDate, startDate) + 1) : 0;

  const handleSubmit = async () => {
    if (!employeeId || !leaveTypeId || !startDate || !endDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("leave_requests").insert({
        employee_id: employeeId,
        company_id: userProfile!.company_id!,
        leave_type_id: leaveTypeId,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        days_count: daysCount,
        reason,
        status: "pending",
      });

      if (error) throw error;

      toast({ title: "Leave request submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Failed to submit leave request", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setLeaveTypeId("");
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Leave Type</Label>
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
              <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
              <SelectContent>
                {leaveTypes.map((lt) => (
                  <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} /></PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => startDate ? date < startDate : false} /></PopoverContent>
              </Popover>
            </div>
          </div>

          {daysCount > 0 && (
            <p className="text-sm text-muted-foreground">Duration: <span className="font-semibold text-foreground">{daysCount} day(s)</span></p>
          )}

          <div>
            <Label>Reason (optional)</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave..." />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit Request"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
