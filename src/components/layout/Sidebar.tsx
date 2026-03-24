import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, Users, BarChart, Settings, Clock, ChartPie,
  UserCog, LogOut, Home, Shield, FileText, ChevronLeft,
  ChevronRight, Lock, CalendarDays, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADICORP_LOGO_PATH } from "@/lib/branding";
import { useAuth } from "@/context/AuthContext";
import { useBiometric } from "@/hooks/useBiometric";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  const { isLockEnabled, isRegistered, lockApp } = useBiometric();
  const isMobile = useIsMobile();
  const compact = !isMobile && collapsed;

  const groups = Object.keys(groupLabels);

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = item.path === "/dashboard"
      ? location.pathname === item.path
      : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    const content = (
      <Link
        to={item.path}
        data-active={isActive ? "true" : "false"}
        className={cn(
          "nav-premium-item flex items-center gap-3 rounded-lg px-3 py-2 group",
          compact && "justify-center px-2.5",
          isActive
            ? "bg-primary text-primary-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
        )}
      >
        <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className={cn(
          "flex-shrink-0 transition-all duration-200",
          !isActive && "group-hover:text-primary group-hover:scale-105"
        )} />
        {!compact && (
          <span className="text-[13px] tracking-[-0.01em] truncate">{item.name}</span>
        )}
        {isActive && !collapsed && (
          <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
        )}
      </Link>
    );

    if (compact) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="font-medium text-xs px-3 py-1.5 rounded-lg">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 flex flex-col z-40 border-r border-border/60 transition-[width,transform] duration-300",
      isMobile
        ? cn("w-[272px]", mobileOpen ? "translate-x-0" : "-translate-x-full")
        : collapsed ? "w-[60px]" : "w-[252px]"
    )} style={{
      background: 'hsl(var(--card))',
      boxShadow: '1px 0 12px -4px hsl(var(--foreground) / 0.06)',
    }}>
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 border-b border-border/40 transition-all duration-300",
        compact ? "px-2.5 py-4 justify-center" : "px-5 py-4"
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-primary/15 shadow-sm">
            <img 
              src={ADICORP_LOGO_PATH}
              alt="AdiCorp Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card bg-primary" />
        </div>
        {!compact && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">AdiCorp HR</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-1">Management</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-[60px] z-50 w-6 h-6 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:border-primary/30"
          style={{ boxShadow: '0 1px 4px hsl(var(--foreground) / 0.08)' }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={11} strokeWidth={2.5} /> : <ChevronLeft size={11} strokeWidth={2.5} />}
        </button>
      )}
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-1" style={{ scrollbarWidth: 'none' }}>
        {groups.map((group, gi) => {
          const items = navItems.filter(i => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className={cn("px-2.5", gi > 0 && "mt-4")}>
              {!compact ? (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
                  {groupLabels[group]}
                </p>
              ) : (
                gi > 0 && <div className="w-6 mx-auto mb-3 border-t border-border/30" />
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
        <div className={cn("px-2.5 pb-1", compact && "px-1.5")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button 
                onClick={lockApp}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 text-[13px]",
                  compact && "justify-center px-2"
                )}
              >
                <Lock size={15} />
                {!compact && <span>Lock App</span>}
              </button>
            </TooltipTrigger>
            {compact && <TooltipContent side="right" sideOffset={8}>Lock App</TooltipContent>}
          </Tooltip>
        </div>
      )}

      {/* User & Logout */}
      <div className={cn(
        "border-t border-border/40 mt-auto transition-all duration-300",
        compact ? "p-2" : "p-3"
      )}>
        <div className={cn(
          "flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-200",
          compact && "justify-center p-2"
        )} style={{
          background: 'hsl(var(--primary) / 0.04)',
          border: '1px solid hsl(var(--primary) / 0.08)',
        }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))',
            border: '1px solid hsl(var(--primary) / 0.12)',
          }}>
            {loading ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <UserCog size={14} className="text-primary" />
            )}
          </div>
          {!compact && (
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
                compact && "justify-center px-2"
              )}
              onClick={() => signOut()}
              type="button"
            >
              <LogOut size={15} className="flex-shrink-0" />
              {!compact && <span className="font-medium">Logout</span>}
            </button>
          </TooltipTrigger>
          {compact && <TooltipContent side="right" sideOffset={8}>Logout</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
}
