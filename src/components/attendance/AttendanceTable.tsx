
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

  const handleDateChange = (newDate: Date | undefined) => { if (newDate) { setDate(newDate); if (employees.length > 0) fetchAttendance(newDate); } };
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
      case 'present': return <Badge className="bg-green-500/20 text-green-600">Present</Badge>;
      case 'short_leave': return <Badge className="bg-yellow-500/20 text-yellow-600">Short Leave</Badge>;
      case 'leave': return <Badge className="bg-red-500/20 text-red-600">Leave</Badge>;
      default: return <Badge className="bg-muted text-muted-foreground">Not Set</Badge>;
    }
  };

  if (loading) {
    return (<div className="flex justify-center items-center py-8"><div className="flex items-center space-x-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-muted-foreground">Loading employees...</span></div></div>);
  }

  if (employees.length === 0) {
    return (<div className="text-center py-8"><p className="text-muted-foreground">No active employees found. Please add employees first.</p></div>);
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="glass-card lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} className="rounded-md border border-border p-3" />
        </CardContent>
      </Card>
      
      <Card className="glass-card lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">Daily Attendance - {date.toLocaleDateString()}</CardTitle>
          <Button onClick={saveAttendance} disabled={saving}>
            {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Attendance</>)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Employee</TableHead><TableHead>Position</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.employeeId} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{employees.find(emp => emp.id === record.employeeId)?.rank || 'N/A'}</TableCell>
                    <TableCell>
                      <Select value={record.status} onValueChange={(value) => handleStatusChange(record.employeeId, value)}>
                        <SelectTrigger className="w-[140px] bg-background border-border">
                          <SelectValue>{getStatusBadge(record.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present (Full Day)</SelectItem>
                          <SelectItem value="short_leave">Short Leave (Half Day)</SelectItem>
                          <SelectItem value="leave">Leave (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
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
