
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { EmployeeRow } from "@/types/supabase";
import { format, addDays, subDays } from "date-fns";

interface AttendanceRecord {
  id?: string; employeeId: string; employeeName: string; date: string; status: string;
}

export default function AttendanceTable() {
  const [date, setDate] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      if (!userProfile?.company_id) return;
      const { data, error } = await supabase.from('employees').select('*').eq('company_id', userProfile.company_id).eq('status', 'active').order('name');
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      toast({ title: "Error fetching employees", description: "Please try again.", variant: "destructive" });
    }
  };

  const fetchAttendance = async (selectedDate: Date) => {
    try {
      if (!userProfile?.company_id || employees.length === 0) return;
      const dateString = selectedDate.toISOString().split('T')[0];
      const employeeIds = employees.map(emp => emp.id);
      const { data: attendanceRecords, error } = await supabase.from('attendance').select('*').eq('date', dateString).in('employee_id', employeeIds);
      if (error && error.code !== 'PGRST116') throw error;
      const attendanceMap = new Map((attendanceRecords || []).map(record => [record.employee_id, record]));
      const data = employees.map(employee => {
        const existingRecord = attendanceMap.get(employee.id);
        return { id: existingRecord?.id, employeeId: employee.id, employeeName: employee.name, date: dateString, status: existingRecord?.status || 'not_set' };
      });
      setAttendanceData(data);
    } catch (error) {
      toast({ title: "Error fetching attendance", description: "Please try again.", variant: "destructive" });
    }
  };

  useEffect(() => {
    const loadData = async () => { setLoading(true); await fetchEmployees(); setLoading(false); };
    if (userProfile?.company_id) loadData();
  }, [userProfile?.company_id]);

  useEffect(() => { if (employees.length > 0) fetchAttendance(date); }, [employees, date]);

  const handleDateChange = (newDate: Date | undefined) => { if (newDate) setDate(newDate); };
  const handleStatusChange = (employeeId: string, status: string) => { setAttendanceData(prev => prev.map(item => item.employeeId === employeeId ? { ...item, status } : item)); };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const updates = attendanceData.filter(record => record.status !== 'not_set').map(record => ({ employee_id: record.employeeId, date: record.date, status: record.status }));
      if (updates.length === 0) { toast({ title: "No attendance to save", description: "Please mark attendance for at least one employee.", variant: "destructive" }); return; }
      const { error } = await supabase.from('attendance').upsert(updates, { onConflict: 'employee_id,date', ignoreDuplicates: false });
      if (error) throw error;
      toast({ title: "Attendance saved", description: `Saved attendance for ${updates.length} employees.` });
      await fetchAttendance(date);
    } catch (error) { toast({ title: "Error saving attendance", description: "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present': return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200/50 font-medium px-3 py-1">Present</Badge>;
      case 'short_leave': return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200/50 font-medium px-3 py-1">Short Leave</Badge>;
      case 'leave': return <Badge className="bg-red-500/15 text-red-600 border-red-200/50 font-medium px-3 py-1">Leave</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground font-medium px-3 py-1">Not Set</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm">Loading employees...</span>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No active employees found. Please add employees first.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Calendar Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-4">
          {/* Quick nav */}
          <div className="flex items-center justify-between mb-3 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setDate(subDays(date, 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <button
              onClick={() => setDate(new Date())}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md hover:bg-primary/5"
            >
              Today
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setDate(addDays(date, 1))}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="rounded-xl border border-border/40 bg-muted/20 mx-auto"
          />
          {/* Selected date display */}
          <div className="mt-3 mx-1 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-0.5">Selected Date</p>
            <p className="text-sm font-semibold text-foreground">{format(date, 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Daily Attendance</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{format(date, 'MMMM d, yyyy')}</p>
          </div>
          <Button onClick={saveAttendance} disabled={saving} className="shadow-sm">
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Attendance</>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 border-border/60">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Employee</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Position</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.employeeId} className="border-border/40 hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground">{record.employeeName}</TableCell>
                    <TableCell className="text-muted-foreground">{employees.find(emp => emp.id === record.employeeId)?.rank || 'N/A'}</TableCell>
                    <TableCell>
                      <Select value={record.status} onValueChange={(value) => handleStatusChange(record.employeeId, value)}>
                        <SelectTrigger className="w-[150px] bg-background border-border/60 rounded-lg h-9">
                          <SelectValue>{getStatusBadge(record.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present (Full Day)</SelectItem>
                          <SelectItem value="short_leave">Short Leave (Half Day)</SelectItem>
                          <SelectItem value="leave">Leave (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(date, 'M/d/yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
