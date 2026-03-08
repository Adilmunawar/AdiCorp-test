import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, FileText } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/hooks/useCurrency";
import MonthSelector from "@/components/common/MonthSelector";
import { useState } from "react";
import { startOfMonth } from "date-fns";

export default function PayslipHistory() {
  const { userProfile } = useAuth();
  const { currency } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  const { data: payslips, isLoading } = useQuery({
    queryKey: ["payslip-history", userProfile?.company_id, format(selectedMonth, "yyyy-MM")],
    queryFn: async () => {
      const monthStr = format(selectedMonth, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("payslips")
        .select("*, employees(name, rank)")
        .eq("company_id", userProfile!.company_id!)
        .eq("month", monthStr)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  const formatAmount = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", minimumFractionDigits: 0 }).format(amount);
    } catch { return `${currency} ${amount.toLocaleString()}`; }
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Payslip History</CardTitle>
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payslips?.map((ps: any) => (
            <div key={ps.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{ps.employees?.name}</p>
                  <p className="text-xs text-muted-foreground">{ps.employees?.rank} • {ps.present_days}P / {ps.short_leave_days}SL • {ps.days_worked} days worked</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{formatAmount(Number(ps.net_salary))}</p>
                <p className="text-xs text-muted-foreground">Gross: {formatAmount(Number(ps.gross_salary))}</p>
              </div>
            </div>
          ))}
          {(!payslips || payslips.length === 0) && <p className="text-center text-muted-foreground py-8">No payslips generated for this month</p>}
        </div>
      </CardContent>
    </Card>
  );
}
