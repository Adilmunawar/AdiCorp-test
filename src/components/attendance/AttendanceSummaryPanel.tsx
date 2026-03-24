import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AttendanceSummary {
  present: number;
  shortLeave: number;
  leave: number;
  notSet: number;
}

interface AttendanceSummaryPanelProps {
  date: Date;
  summary: AttendanceSummary;
  totalEmployees: number;
}

export function AttendanceSummaryPanel({ date, summary, totalEmployees }: AttendanceSummaryPanelProps) {
  const markedCount = totalEmployees - summary.notSet;
  const completion = totalEmployees > 0 ? Math.round((markedCount / totalEmployees) * 100) : 0;

  return (
    <Card className="border border-border bg-card lg:col-span-3 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">Attendance Summary · {format(date, "dd/MM/yyyy")}</CardTitle>
          <p className="text-sm text-muted-foreground">{markedCount}/{totalEmployees} employees marked</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Coverage</p>
            <p className="text-xs font-medium text-foreground">{completion}%</p>
          </div>
          <Progress value={completion} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
  );
}