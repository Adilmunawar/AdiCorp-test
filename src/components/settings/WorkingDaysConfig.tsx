
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Check, AlertCircle } from "lucide-react";
import { WorkingDayConfig } from "@/types/events";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import BrandLoader from "@/components/common/BrandLoader";

export default function WorkingDaysConfig() {
  const [config, setConfig] = useState<WorkingDayConfig>({
    company_id: '',
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile?.company_id) {
      fetchConfig();
    }
  }, [userProfile?.company_id]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('working_days_config')
        .select('*')
        .eq('company_id', userProfile?.company_id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig(data);
      } else {
        setConfig(prev => ({ ...prev, company_id: userProfile?.company_id || '' }));
      }
    } catch (error) {
      console.error("Error fetching working days config:", error);
      toast({
        title: "Error",
        description: "Failed to load working days configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day: keyof WorkingDayConfig, checked: boolean) => {
    setConfig(prev => ({ ...prev, [day]: checked }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!userProfile?.company_id) return;

      const { error } = await supabase
        .from('working_days_config')
        .upsert({
          company_id: userProfile.company_id,
          monday: config.monday,
          tuesday: config.tuesday,
          wednesday: config.wednesday,
          thursday: config.thursday,
          friday: config.friday,
          saturday: config.saturday,
          sunday: config.sunday,
        }, {
          onConflict: 'company_id'
        });

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: "Settings Saved",
        description: "Working days configuration has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Error",
        description: "Failed to save working days configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Monday', shortLabel: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
    { key: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
    { key: 'friday', label: 'Friday', shortLabel: 'Fri' },
    { key: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
    { key: 'sunday', label: 'Sunday', shortLabel: 'Sun' },
  ];

  const selectedDaysCount = days.filter(day => 
    config[day.key as keyof WorkingDayConfig] as boolean
  ).length;

  const applyTemplate = (mode: "mon_fri" | "mon_sat") => {
    const nextConfig = {
      ...config,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: mode === "mon_sat",
      sunday: false,
    };

    setConfig(nextConfig);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <BrandLoader
        message="Loading day management"
        subtitle="Syncing your company working-day rules"
      />
    );
  }

  return (
    <ResponsiveContainer>
      <Card className="glass-card transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Settings className="h-5 w-5 text-primary" />
            Working Days Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure which days are considered working days for your company.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium text-foreground">Quick Templates</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate("mon_fri")}>Mon–Fri</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => applyTemplate("mon_sat")}>Mon–Sat</Button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {selectedDaysCount} working {selectedDaysCount === 1 ? 'day' : 'days'} per week selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {days.map((day) => {
              const isChecked = config[day.key as keyof WorkingDayConfig] as boolean;
              return (
                <div 
                  key={day.key} 
                  className={`
                    flex flex-col items-center space-y-2 p-3 rounded-lg border transition-all duration-200
                    ${isChecked 
                      ? 'bg-primary/10 border-primary/40' 
                      : 'bg-card border-border'
                    }
                    hover:border-primary/60
                  `}
                >
                  <Switch
                    id={day.key}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleDayChange(day.key as keyof WorkingDayConfig, checked)}
                    aria-label={`Toggle ${day.label} as working day`}
                  />
                  <Label 
                    htmlFor={day.key} 
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer select-none"
                  >
                    <span className="block sm:hidden">{day.shortLabel}</span>
                    <span className="hidden sm:block">{day.label}</span>
                  </Label>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Important Notes:</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Employees will only appear in attendance for configured working days</li>
                  <li>Salary calculations will be based on selected working days</li>
                  <li>Changes take effect immediately after saving</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
            <Button 
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex-1 sm:flex-none"
              aria-label="Save working days configuration"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-foreground/40 border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
            
            {hasChanges && (
              <Button 
                variant="outline" 
                onClick={() => {
                  fetchConfig();
                  setHasChanges(false);
                }}
              >
                Reset Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
}
