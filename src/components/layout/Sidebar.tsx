
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, Users, BarChart, Settings, Clock, ChartPie,
  UserCog, LogOut, Home, Shield, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Employees", icon: Users, path: "/employees" },
  { name: "Attendance", icon: Clock, path: "/attendance" },
  { name: "Salary", icon: BarChart, path: "/salary" },
  { name: "Reports", icon: ChartPie, path: "/reports" },
  { name: "Working Days", icon: Calendar, path: "/working-days" },
  { name: "Events", icon: Shield, path: "/events" },
  { name: "Timeline Logs", icon: FileText, path: "/timeline-logs" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  
  return (
    <div className="w-64 h-screen bg-card border-r border-border fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img 
            src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" 
            alt="AdiCorp Logo" 
            className="w-9 h-9 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          />
          <div>
            <h1 className="text-base font-semibold text-foreground">AdiCorp HR</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <item.icon size={18} className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  isActive ? "text-primary" : "group-hover:scale-110 group-hover:text-primary"
                )} />
                <span className="text-sm">{item.name}</span>
                {/* Hover shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-opacity duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User & Logout */}
      <div className="border-t border-border p-3 mt-auto">
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg bg-muted/50 transition-colors duration-200 hover:bg-muted">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {loading ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <UserCog size={14} className="text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-foreground truncate">
              {loading ? "Loading..." : user?.email?.split('@')[0] || "Admin"}
            </h3>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        
        <button 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 w-full group"
          onClick={() => signOut()}
        >
          <LogOut size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
