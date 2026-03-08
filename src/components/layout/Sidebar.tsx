import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, Users, BarChart, Settings, Clock, ChartPie,
  UserCog, LogOut, Home, Shield, FileText, ChevronLeft, 
  ChevronRight, Lock, CalendarDays, Timer,
  Sparkles
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
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
          collapsed && "justify-center px-2.5",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
        style={isActive ? {
          boxShadow: '0 1px 3px hsl(var(--primary) / 0.3), 0 4px 12px -2px hsl(var(--primary) / 0.15)'
        } : undefined}
      >
        <item.icon size={17} className={cn(
          "flex-shrink-0 transition-colors duration-200",
          !isActive && "group-hover:text-primary"
        )} />
        {!collapsed && (
          <span className="text-[13px] tracking-[-0.01em] truncate">{item.name}</span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="font-medium text-xs">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 flex flex-col z-40 transition-all duration-300 border-r border-border/60",
      collapsed ? "w-[60px]" : "w-[252px]"
    )} style={{
      background: 'linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)',
    }}>
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 border-b border-border/40 transition-all duration-300",
        collapsed ? "px-2.5 py-4 justify-center" : "px-5 py-4"
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-border/50">
            <img 
              src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" 
              alt="AdiCorp Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card" style={{ background: 'hsl(152 69% 53%)' }} />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">AdiCorp HR</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">Management</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button 
        onClick={toggleCollapsed}
        className="absolute -right-3 top-[60px] z-50 w-6 h-6 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:border-primary/30"
        style={{ boxShadow: '0 1px 4px hsl(var(--foreground) / 0.08)' }}
      >
        {collapsed ? <ChevronRight size={11} strokeWidth={2.5} /> : <ChevronLeft size={11} strokeWidth={2.5} />}
      </button>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'none' }}>
        {groups.map((group, gi) => {
          const items = navItems.filter(i => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className={cn("px-2.5", gi > 0 && "mt-4")}>
              {!collapsed ? (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
                  {groupLabels[group]}
                </p>
              ) : (
                gi > 0 && <div className="w-5 mx-auto mb-2.5 border-t border-border/40" />
              )}
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
        <div className={cn("px-2.5 pb-1", collapsed && "px-1.5")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button 
                onClick={lockApp}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/8 transition-all duration-200 text-[13px]",
                  collapsed && "justify-center px-2"
                )}
              >
                <Lock size={15} />
                {!collapsed && <span>Lock App</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right" sideOffset={8}>Lock App</TooltipContent>}
          </Tooltip>
        </div>
      )}

      {/* User & Logout */}
      <div className={cn(
        "border-t border-border/40 mt-auto transition-all duration-300",
        collapsed ? "p-2" : "p-3"
      )}>
        <div className={cn(
          "flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-200",
          collapsed && "justify-center p-2"
        )} style={{
          background: 'hsl(var(--primary) / 0.04)',
          border: '1px solid hsl(var(--primary) / 0.08)',
        }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.06))',
            border: '1px solid hsl(var(--primary) / 0.15)',
          }}>
            {loading ? (
              <Loader2 size={13} className="animate-spin text-primary" />
            ) : (
              <UserCog size={13} className="text-primary" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-semibold text-foreground truncate leading-none">
                {loading ? "Loading..." : user?.email?.split('@')[0] || "Admin"}
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Administrator</p>
            </div>
          )}
        </div>
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button 
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 w-full mt-1 text-[13px]",
                collapsed && "justify-center px-2"
              )}
              onClick={() => signOut()}
            >
              <LogOut size={15} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right" sideOffset={8}>Logout</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );
}
