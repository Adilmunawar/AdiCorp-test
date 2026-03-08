
import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, Download, RefreshCw, History, Save } from "lucide-react";
import { useSalaryData } from "@/hooks/useSalaryData";
import { useSalaryDownloads } from "@/hooks/useSalaryDownloads";
import SalaryStats from "@/components/salary/SalaryStats";
import SalarySheet from "@/components/salary/SalarySheet";
import PayslipsGrid from "@/components/salary/PayslipsGrid";
import PayslipHistory from "@/components/salary/PayslipHistory";
import MonthSelector from "@/components/common/MonthSelector";
import { startOfMonth, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState("salary-sheet");
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [generating, setGenerating] = useState(false);
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  
  const { employeeSalaryData, loading, stats, error, totalWorkingDaysThisMonth, currentMonthName, handleRetry } = useSalaryData(selectedMonth);
  const { downloading, handleSalarySheetDownload, handlePayslipsDownload, handleIndividualPayslipDownload } = useSalaryDownloads(employeeSalaryData, totalWorkingDaysThisMonth, currentMonthName);

  const handleGeneratePayslips = async () => {
    if (!userProfile?.company_id || employeeSalaryData.length === 0) return;
    setGenerating(true);
    try {
      const monthStr = format(selectedMonth, "yyyy-MM-dd");
      const payslips = employeeSalaryData.map((emp) => ({
        employee_id: emp.employeeId,
        company_id: userProfile.company_id!,
        month: monthStr,
        basic_salary: emp.monthlySalary,
        daily_rate: emp.dailyRate,
        days_worked: emp.actualWorkingDays,
        present_days: emp.presentDays,
        short_leave_days: emp.shortLeaveDays,
        gross_salary: emp.calculatedSalary,
        net_salary: emp.calculatedSalary,
        total_deductions: 0,
        generated_by: user?.id,
      }));

      const { error } = await supabase.from("payslips").insert(payslips);
      if (error) throw error;
      toast({ title: `${payslips.length} payslips generated and saved` });
    } catch (error: any) {
      toast({ title: "Failed to generate payslips", description: error.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  if (error && !loading) {
    return (
      <Dashboard title="Salary Management">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRetry}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>
        </div>
      </Dashboard>
    );
  }
  
  return (
    <Dashboard title="Salary Management">
      <div className="flex justify-between items-center mb-6">
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Viewing data for {currentMonthName}</div>
          <Button onClick={handleGeneratePayslips} disabled={generating || loading || employeeSalaryData.length === 0} variant="outline" className="gap-2">
            <Save className="h-4 w-4" />{generating ? "Generating..." : "Save Payslips"}
          </Button>
        </div>
      </div>

      <SalaryStats stats={stats} loading={loading} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="salary-sheet"><FileSpreadsheet className="h-4 w-4 mr-2" />Salary Sheet</TabsTrigger>
          <TabsTrigger value="payslips"><Download className="h-4 w-4 mr-2" />Payslips</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" />History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salary-sheet">
          <SalarySheet employeeSalaryData={employeeSalaryData} totalWorkingDaysThisMonth={totalWorkingDaysThisMonth} currentMonthName={currentMonthName} loading={loading} downloading={downloading} onDownload={handleSalarySheetDownload} />
        </TabsContent>
        
        <TabsContent value="payslips">
          <PayslipsGrid employeeSalaryData={employeeSalaryData} totalWorkingDaysThisMonth={totalWorkingDaysThisMonth} currentMonthName={currentMonthName} loading={loading} downloading={downloading} onDownloadAll={handlePayslipsDownload} onDownloadIndividual={handleIndividualPayslipDownload} />
        </TabsContent>

        <TabsContent value="history">
          <PayslipHistory />
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
}
