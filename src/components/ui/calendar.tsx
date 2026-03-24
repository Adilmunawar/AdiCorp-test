import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 pointer-events-auto rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.05),0_8px_28px_-18px_hsl(var(--foreground)/0.25)]",
        className
      )}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-5",
        month: "space-y-4",
        caption: "relative flex items-center justify-center px-8 pt-1",
        caption_label: "text-[0.95rem] font-semibold tracking-tight",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-xl bg-background/70 p-0 opacity-80 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-separate border-spacing-y-1",
        head_row: "flex",
        head_cell:
          "w-10 rounded-md text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
        row: "mt-1 flex w-full",
        cell: "h-10 w-10 p-0 text-center text-sm relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/40 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 rounded-xl p-0 font-medium aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground shadow-[0_6px_18px_-8px_hsl(var(--primary)/0.55)] hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground ring-1 ring-border",
        day_outside:
          "day-outside text-muted-foreground/40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/30",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
