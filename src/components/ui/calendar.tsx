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
      className={cn("p-4 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-sm font-semibold text-foreground tracking-wide",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200",
          "h-8 w-8 bg-transparent p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-medium text-[0.7rem] uppercase tracking-wider",
        row: "flex w-full mt-1",
        cell: cn(
          "relative h-10 w-10 text-center text-sm p-0 focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-lg",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-lg",
          "last:[&:has([aria-selected])]:rounded-r-lg"
        ),
        day: cn(
          "inline-flex items-center justify-center rounded-lg font-normal transition-all duration-200",
          "h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground",
          "aria-selected:opacity-100 cursor-pointer"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
        day_today: "bg-accent text-accent-foreground font-semibold ring-1 ring-primary/30",
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
