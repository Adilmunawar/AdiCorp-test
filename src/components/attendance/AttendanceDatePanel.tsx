import { addDays, format, isToday } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceDatePanelProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function AttendanceDatePanel({ date, onDateChange }: AttendanceDatePanelProps) {
  return (
    <Card className="border border-border bg-card lg:col-span-1 shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Date Selection
        </CardTitle>
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Selected day</p>
          <p className="mt-1 text-base font-semibold text-foreground">{format(date, "EEEE, MMM d")}</p>
          <Badge variant="secondary" className="mt-2">
            {isToday(date) ? "Today" : format(date, "yyyy")}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(date, -1))}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Prev
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onDateChange(new Date())}>
            <RotateCcw className="mr-1 h-4 w-4" /> Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(date, 1))}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center pb-5">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => selected && onDateChange(selected)}
          className="w-full max-w-[320px] rounded-2xl border border-border/80 bg-background p-2 shadow-[0_10px_24px_-18px_hsl(var(--foreground)/0.35)]"
          classNames={{
            day_selected:
              "bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_hsl(var(--primary)/0.7)] hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-secondary text-secondary-foreground ring-1 ring-primary/25",
            nav_button: "h-8 w-8 rounded-lg border border-border bg-background p-0 opacity-100 hover:bg-accent",
            head_cell: "w-10 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
          }}
        />
      </CardContent>
    </Card>
  );
}