
import Dashboard from "@/components/layout/Dashboard";
import AttendanceTable from "@/components/attendance/AttendanceTable";

const AttendancePage = () => {
  return (
    <Dashboard title="Daily Attendance">
      <div className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Attendance Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Track daily workforce attendance with clearer status control and a more robust workflow.</p>
        </div>
        <AttendanceTable />
      </div>
    </Dashboard>
  );
};

export default AttendancePage;
