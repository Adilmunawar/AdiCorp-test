
import Dashboard from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building, Calendar, Clock, DollarSign, Lock, Database, ShieldCheck } from "lucide-react";
import CompanySetupModal from "@/components/company/CompanySetupModal";
import CurrencySettings from "@/components/settings/CurrencySettings";
import WorkingDaysConfig from "@/components/settings/WorkingDaysConfig";
import MonthlyWorkingDaysManager from "@/components/settings/MonthlyWorkingDaysManager";
import WorkingTimePolicies from "@/components/settings/WorkingTimePolicies";
import PasswordSettings from "@/components/settings/PasswordSettings";
import BackupManager from "@/components/backup/BackupManager";
import SecuritySettings from "@/components/settings/SecuritySettings";

export default function SettingsPage() {
  return (
    <Dashboard title="Settings">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="glass-card p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2 text-foreground">System Settings</h1>
            <p className="text-muted-foreground text-lg">
              Configure your company settings, preferences, and system parameters
            </p>
          </div>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <div className="glass-card p-2">
            <TabsList className="bg-muted/50 grid grid-cols-4 md:grid-cols-8 p-1.5 gap-1 h-auto">
              {[
                { value: "company", icon: Building, label: "Company" },
                { value: "currency", icon: DollarSign, label: "Currency" },
                { value: "working-days", icon: Calendar, label: "Working Days" },
                { value: "monthly-config", icon: Settings, label: "Monthly" },
                { value: "policies", icon: Clock, label: "Policies" },
                { value: "security", icon: ShieldCheck, label: "Security" },
                { value: "password", icon: Lock, label: "Password" },
                { value: "backup", icon: Database, label: "Backup" },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {[
            { value: "company", icon: Building, title: "Company Information", desc: "Manage your company details and branding", color: "text-primary", bg: "bg-primary/10", content: <CompanySetupModal /> },
            { value: "currency", icon: DollarSign, title: "Currency Settings", desc: "Configure your preferred currency for salary calculations", color: "text-green-600", bg: "bg-green-500/10", content: <CurrencySettings /> },
            { value: "working-days", icon: Calendar, title: "Working Days Configuration", desc: "Set up your company's working days and weekend schedule", color: "text-blue-600", bg: "bg-blue-500/10", content: <WorkingDaysConfig /> },
            { value: "monthly-config", icon: Settings, title: "Monthly Working Days", desc: "Configure working days and salary divisors for specific months", color: "text-violet-600", bg: "bg-violet-500/10", content: <MonthlyWorkingDaysManager /> },
            { value: "policies", icon: Clock, title: "Working Time Policies", desc: "Define working hours, overtime rules, and time-off policies", color: "text-orange-600", bg: "bg-orange-500/10", content: <WorkingTimePolicies /> },
            { value: "password", icon: Lock, title: "Password & Security", desc: "Update your password and manage security settings", color: "text-red-600", bg: "bg-red-500/10", content: <PasswordSettings /> },
            { value: "backup", icon: Database, title: "Backup & Restore", desc: "Create backups and restore your data safely", color: "text-teal-600", bg: "bg-teal-500/10", content: <BackupManager /> },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${tab.bg}`}>
                      <Icon className={`h-6 w-6 ${tab.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">{tab.title}</h2>
                      <p className="text-muted-foreground">{tab.desc}</p>
                    </div>
                  </div>
                  {tab.content}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Dashboard>
  );
}
