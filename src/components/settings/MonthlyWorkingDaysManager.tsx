
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, startOfMonth } from "date-fns";
import { CalendarDays, Save } from "lucide-react";

interface MonthlyConfig {
  id?: string;
  company_id: string;
  month: string;
  working_days_count: number;
  daily_rate_divisor: number;
  configuration: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export default function MonthlyWorkingDaysManager() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [monthlyConfig, setMonthlyConfig] = useState<MonthlyConfig | null>(null);
  const [workingDaysCount, setWorkingDaysCount] = useState(22);
  const [dailyRateDivisor, setDailyRateDivisor] = useState(26);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const clampRange = (value: number, min = 1, max = 31) => Math.min(max, Math.max(min, value));

  const handleWorkingDaysCountChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setWorkingDaysCount(clampRange(parsed));
  };

  const handleDailyRateDivisorChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setDailyRateDivisor(clampRange(parsed));
  };

  useEffect(() => {
    if (userProfile?.company_id) {
      fetchMonthlyConfig();
    }
  }, [selectedMonth, userProfile?.company_id]);

  const fetchMonthlyConfig = async () => {
    if (!userProfile?.company_id) return;

    try {
      const monthKey = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('monthly_working_days')
        .select('*')
        .eq('company_id', userProfile.company_id)
        .eq('month', monthKey)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching monthly config:", error);
        return;
      }

      if (data) {
        const config: MonthlyConfig = {
          ...data,
          configuration: typeof data.configuration === 'string' 
            ? JSON.parse(data.configuration) 
            : data.configuration || {}
        };
        setMonthlyConfig(config);
        setWorkingDaysCount(config.working_days_count);
        setDailyRateDivisor(config.daily_rate_divisor);
      } else {
        setMonthlyConfig(null);
        setWorkingDaysCount(22);
        setDailyRateDivisor(26);
      }
    } catch (error) {
      console.error("Error fetching monthly config:", error);
    }
  };

  const saveMonthlyConfig = async () => {
    if (!userProfile?.company_id) return;

    setLoading(true);
    try {
      const monthKey = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
      const configData = {
        company_id: userProfile.company_id,
        month: monthKey,
        working_days_count: workingDaysCount,
        daily_rate_divisor: dailyRateDivisor,
        configuration: {}
      };

      const { error } = await supabase
        .from('monthly_working_days')
        .upsert(configData, { 
          onConflict: 'company_id,month' 
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Monthly Configuration Saved",
        description: `Working days configuration for ${format(selectedMonth, 'MMMM yyyy')} has been updated.`,
      });

      fetchMonthlyConfig();
    } catch (error: any) {
      console.error("Error saving monthly config:", error);
      toast({
        title: "Error saving configuration",
        description: error.message || "Failed to save monthly working days configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2" />
          Monthly Working Days Manager
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Override default day/divisor values month-by-month for more accurate payroll outcomes.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block text-sm font-medium">Select Month</Label>
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              className="rounded-md border border-border bg-card p-3 pointer-events-auto"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Selected Month</Label>
              <p className="text-xl font-semibold text-foreground">{format(selectedMonth, 'MMMM yyyy')}</p>
              <p className="text-xs text-muted-foreground">Changes in this panel only affect this month.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="workingDays">Working Days Count</Label>
                <Input
                  id="workingDays"
                  type="number"
                  min="1"
                  max="31"
                  value={workingDaysCount}
                  onChange={(e) => handleWorkingDaysCountChange(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Total working days for this month
                </p>
              </div>

              <div>
                <Label htmlFor="divisor">Daily Rate Divisor</Label>
                <Input
                  id="divisor"
                  type="number"
                  min="1"
                  max="31"
                  value={dailyRateDivisor}
                  onChange={(e) => handleDailyRateDivisorChange(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Number to divide monthly salary by for daily rate (typically 26)
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs font-medium text-foreground">Quick Presets</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => { setWorkingDaysCount(22); setDailyRateDivisor(22); }}>
                    Standard 22/22
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setWorkingDaysCount(26); setDailyRateDivisor(26); }}>
                    Extended 26/26
                  </Button>
                </div>
              </div>

              <Button 
                onClick={saveMonthlyConfig}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            </div>

            {monthlyConfig && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-sm text-primary">
                  ✓ Custom configuration exists for this month
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
