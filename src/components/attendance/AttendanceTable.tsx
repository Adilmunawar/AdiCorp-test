
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Calendar as CalendarIcon } from "lucide-react";
import { EmployeeRow } from "@/types/supabase";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      if (!userProfile?.company_id) return;
      if (employees.length === 0) {
        setAttendanceData([]);
        return;
      }

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
    else setLoading(false);
  }, [userProfile?.company_id]);

  useEffect(() => {
    if (userProfile?.company_id) {
      fetchAttendance(date);
    }
  }, [employees, date, userProfile?.company_id]);

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
      case 'present': return <Badge variant="default">Present</Badge>;
      case 'short_leave': return <Badge variant="secondary">Short Leave</Badge>;
      case 'leave': return <Badge variant="destructive">Leave</Badge>;
      default: return <Badge className="bg-muted text-muted-foreground">Not Set</Badge>;
    }
  };

  const employeeRankMap = useMemo(() => {
    return new Map(employees.map((employee) => [employee.id, employee.rank]));
  }, [employees]);

  const summary = useMemo(() => {
    const present = attendanceData.filter((record) => record.status === "present").length;
    const shortLeave = attendanceData.filter((record) => record.status === "short_leave").length;
    const leave = attendanceData.filter((record) => record.status === "leave").length;
    const notSet = attendanceData.filter((record) => record.status === "not_set").length;

    return { present, shortLeave, leave, notSet };
  }, [attendanceData]);

  if (loading) {
    return (<div className="flex justify-center items-center py-8"><div className="flex items-center space-x-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-muted-foreground">Loading employees...</span></div></div>);
  }

  if (!userProfile?.company_id) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">Please complete company setup before marking attendance.</p>
        <Button variant="outline" onClick={() => navigate('/settings')}>Go to Settings</Button>
      </div>
    );
  }

  if (employees.length === 0) {
    return (<div className="text-center py-8"><p className="text-muted-foreground">No active employees found. Please add employees first.</p></div>);
  }
  
  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-foreground">Daily Attendance Tracker</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Mark, review, and save attendance with clear daily status visibility.</p>
          </div>
          <Button onClick={saveAttendance} disabled={saving}>
            {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Attendance</>)}
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="border border-border bg-card lg:col-span-1 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} />
        </CardContent>
      </Card>
      
      <Card className="border border-border bg-card lg:col-span-3 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Attendance Summary · {date.toLocaleDateString()}</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-lg font-semibold text-foreground">{summary.present}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Short Leave</p>
              <p className="text-lg font-semibold text-foreground">{summary.shortLeave}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Leave</p>
              <p className="text-lg font-semibold text-foreground">{summary.leave}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Not Set</p>
              <p className="text-lg font-semibold text-foreground">{summary.notSet}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Employee</TableHead><TableHead>Position</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.employeeId} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{employeeRankMap.get(record.employeeId) || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                      <Select value={record.status} onValueChange={(value) => handleStatusChange(record.employeeId, value)}>
                        <SelectTrigger className="w-[170px] bg-background border-border">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_set">Not Set</SelectItem>
                          <SelectItem value="present">Present (Full Day)</SelectItem>
                          <SelectItem value="short_leave">Short Leave (Half Day)</SelectItem>
                          <SelectItem value="leave">Leave (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
                      {getStatusBadge(record.status)}
                      </div>
                    </TableCell>
                    <TableCell>{date.toLocaleDateString()}</TableCell>
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
