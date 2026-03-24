import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Clock, Calendar } from "lucide-react";

interface CompanyWorkingSettings {
  company_id: string;
  default_working_days_per_week: number;
  default_working_days_per_month: number;
  salary_divisor: number;
  weekend_saturday: boolean;
  weekend_sunday: boolean;
}

export default function CompanyWorkingSettings() {
  const [settings, setSettings] = useState<CompanyWorkingSettings>({
    company_id: '',
    default_working_days_per_week: 5,
    default_working_days_per_month: 22,
    salary_divisor: 22,
    weekend_saturday: false,
    weekend_sunday: true,
  });
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const workweekOptions = [
    { value: 5, title: "5-Day Week", description: "Monday to Friday" },
    { value: 6, title: "6-Day Week", description: "Monday to Saturday" },
  ];

  useEffect(() => {
    if (userProfile?.company_id) { fetchSettings(); }
  }, [userProfile?.company_id]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('company_working_settings').select('*').eq('company_id', userProfile?.company_id).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) { setSettings(data); } else { setSettings(prev => ({ ...prev, company_id: userProfile?.company_id || '' })); }
    } catch (error) { console.error("Error fetching company working settings:", error); }
  };

  const handleWorkingDaysChange = (value: string) => {
    const workingDays = parseInt(value);
    const saturdayWorking = workingDays === 6;
    setSettings(prev => ({ ...prev, default_working_days_per_week: workingDays, default_working_days_per_month: saturdayWorking ? 26 : 22, salary_divisor: saturdayWorking ? 26 : 22, weekend_saturday: saturdayWorking }));
  };

  const handleSaturdayChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, weekend_saturday: checked, default_working_days_per_week: checked ? 6 : 5, default_working_days_per_month: checked ? 26 : 22, salary_divisor: checked ? 26 : 22 }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!userProfile?.company_id) return;
      const { error } = await supabase.from('company_working_settings').upsert({ company_id: userProfile.company_id, default_working_days_per_week: settings.default_working_days_per_week, default_working_days_per_month: settings.default_working_days_per_month, salary_divisor: settings.salary_divisor, weekend_saturday: settings.weekend_saturday, weekend_sunday: settings.weekend_sunday }, { onConflict: 'company_id' });
      if (error) throw error;
      toast({ title: "Settings Saved", description: "Company working settings have been updated. Salary divisor is now " + (settings.weekend_saturday ? "26" : "22") + "." });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Failed to save company working settings.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Company Working Days Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set your default workweek and divisor logic used in attendance and salary workflows.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Workweek Template</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workweekOptions.map((option) => {
                  const isActive = settings.default_working_days_per_week === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleWorkingDaysChange(option.value.toString())}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sunday" className="text-sm">Sunday as Off Day</Label>
              <Switch id="sunday" checked={settings.weekend_sunday} onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weekend_sunday: checked }))} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="saturday" className="text-sm">Saturday as Working Day</Label>
              <Switch id="saturday" checked={settings.weekend_saturday} onCheckedChange={handleSaturdayChange} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Monthly Summary</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Working Days per Month: <span className="text-foreground font-medium">{settings.default_working_days_per_month}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Salary Divisor: <span className="text-foreground font-medium">{settings.salary_divisor}</span>
              </p>
            </div>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Applied Logic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.weekend_saturday ? "Saturday is working day → Salary ÷ 26 for daily rate" : "Saturday is off → Salary ÷ 22 for daily rate"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
