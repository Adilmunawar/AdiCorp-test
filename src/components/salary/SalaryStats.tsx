
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Calendar, Briefcase, Loader2 } from "lucide-react";
import { formatCurrencySync } from "@/utils/salaryCalculations";
import { useCurrency } from "@/hooks/useCurrency";

interface SalaryStats {
  totalBudgetSalary: number;
  totalCalculatedSalary: number;
  averageDailyRate: number;
  employeeCount: number;
}

interface SalaryStatsProps {
  stats: SalaryStats;
  loading: boolean;
}

export default function SalaryStats({ stats, loading }: SalaryStatsProps) {
  useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Salary Budget</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
            <>
              <div className="flex items-center">
                <CircleDollarSign className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold text-foreground">{formatCurrencySync(stats.totalBudgetSalary)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">For {stats.employeeCount} active employees</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Calculated Salary (Attendance-Based)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
            <>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold text-foreground">{formatCurrencySync(stats.totalCalculatedSalary)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Based on actual attendance</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Daily Rate</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
            <>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold text-foreground">{formatCurrencySync(stats.averageDailyRate)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per employee per working day</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
