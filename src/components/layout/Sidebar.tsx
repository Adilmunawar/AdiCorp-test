import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, Users, BarChart, Settings, Clock, ChartPie,
  UserCog, LogOut, Home, Shield, FileText, ChevronLeft, 
  ChevronRight, Fingerprint, Lock, CalendarDays, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useBiometric } from "@/hooks/useBiometric";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard", group: "main" },
  { name: "Employees", icon: Users, path: "/employees", group: "main" },
  { name: "Attendance", icon: Clock, path: "/attendance", group: "main" },
  { name: "Leave Management", icon: CalendarDays, path: "/leave-management", group: "hr" },
  { name: "Salary", icon: BarChart, path: "/salary", group: "finance" },
  { name: "Overtime", icon: Timer, path: "/overtime", group: "finance" },
  { name: "Reports", icon: ChartPie, path: "/reports", group: "finance" },
  { name: "Working Days", icon: Calendar, path: "/working-days", group: "config" },
  { name: "Events", icon: Shield, path: "/events", group: "config" },
  { name: "Timeline Logs", icon: FileText, path: "/timeline-logs", group: "system" },
  { name: "Settings", icon: Settings, path: "/settings", group: "system" },
];

const groupLabels: Record<string, string> = {
  main: "Overview",
  hr: "HR",
  finance: "Finance",
  config: "Configuration", 
  system: "System",
};

export default function Sidebar() {
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  const { isLockEnabled, isRegistered, lockApp } = useBiometric();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
    window.dispatchEvent(new Event('sidebar-toggle'));
  };
  
  const groups = Object.keys(groupLabels);

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path;
    const content = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
        )}
      >
        <item.icon size={18} className={cn(
          "flex-shrink-0 transition-all duration-300",
          isActive ? "" : "group-hover:scale-110 group-hover:text-primary"
        )} />
        {!collapsed && (
          <span className="text-sm font-medium truncate">{item.name}</span>
        )}
        {/* Hover glow */}
        {!isActive && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent transition-opacity duration-500 pointer-events-none rounded-xl" />
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border fixed left-0 top-0 overflow-y-auto flex flex-col transition-all duration-300 z-40",
      collapsed ? "w-[68px]" : "w-64"
    )}>
      {/* Header */}
      <div className={cn("border-b border-border transition-all duration-300", collapsed ? "p-3" : "p-4")}>
        <div className={cn("flex items-center gap-3 group cursor-pointer", collapsed && "justify-center")}>
          <div className="relative">
            <img 
              src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" 
              alt="AdiCorp Logo" 
              className="w-9 h-9 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-foreground tracking-tight">AdiCorp HR</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button 
        onClick={toggleCollapsed}
        className="absolute -right-3 top-[68px] z-50 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-110"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
      
      {/* Navigation */}
      <div className="flex-1 px-2 py-3 overflow-y-auto">
        {groups.map((group) => {
          const items = navItems.filter(i => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-3">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {groupLabels[group]}
                </p>
              )}
              {collapsed && <div className="w-6 mx-auto mb-2 border-t border-border/50" />}
              <nav className="space-y-0.5">
                {items.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      {isRegistered && isLockEnabled && (
        <div className={cn("px-2 pb-1", collapsed && "px-1")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button 
                onClick={lockApp}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-all duration-200",
                  collapsed && "justify-center px-2"
                )}
              >
                <Lock size={16} />
                {!collapsed && <span className="text-sm">Lock App</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Lock App</TooltipContent>}
          </Tooltip>
        </div>
      )}

      {/* User & Logout */}
      <div className={cn("border-t border-border p-2 mt-auto", collapsed && "p-1.5")}>
        <div className={cn(
          "flex items-center gap-3 mb-2 p-2.5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/30 transition-all duration-300 hover:from-primary/10 hover:to-accent/50",
          collapsed && "justify-center p-2"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
            {loading ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <UserCog size={14} className="text-primary" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {loading ? "Loading..." : user?.email?.split('@')[0] || "Admin"}
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium">Administrator</p>
            </div>
          )}
        </div>
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 w-full group",
                collapsed && "justify-center px-2"
              )}
              onClick={() => signOut()}
            >
              <LogOut size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );
}
