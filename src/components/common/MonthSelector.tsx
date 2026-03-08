
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths, startOfMonth } from "date-fns";

interface MonthSelectorProps { selectedMonth: Date; onMonthChange: (month: Date) => void; className?: string; }

export default function MonthSelector({ selectedMonth, onMonthChange, className }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handlePreviousMonth = () => onMonthChange(startOfMonth(subMonths(selectedMonth, 1)));
  const handleNextMonth = () => onMonthChange(startOfMonth(addMonths(selectedMonth, 1)));
  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  const canGoNext = !isCurrentMonth || format(selectedMonth, 'yyyy-MM') < format(new Date(), 'yyyy-MM');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button variant="outline" size="sm" onClick={handlePreviousMonth} className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[140px] justify-start"><Calendar className="mr-2 h-4 w-4" />{format(selectedMonth, 'MMMM yyyy')}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(selectedMonth.getFullYear(), i, 1);
                const isSelected = format(month, 'yyyy-MM') === format(selectedMonth, 'yyyy-MM');
                return (
                  <Button key={i} variant={isSelected ? "default" : "ghost"} size="sm"
                    onClick={() => { onMonthChange(startOfMonth(month)); setIsOpen(false); }}>
                    {format(month, 'MMM')}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => onMonthChange(startOfMonth(new Date(selectedMonth.getFullYear() - 1, selectedMonth.getMonth(), 1)))}>{selectedMonth.getFullYear() - 1}</Button>
              <span className="font-medium">{selectedMonth.getFullYear()}</span>
              <Button variant="ghost" size="sm" onClick={() => onMonthChange(startOfMonth(new Date(selectedMonth.getFullYear() + 1, selectedMonth.getMonth(), 1)))}>{selectedMonth.getFullYear() + 1}</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="sm" onClick={handleNextMonth} disabled={!canGoNext} className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );
}
