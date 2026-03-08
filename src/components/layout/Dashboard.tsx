import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface DashboardProps {
  children: ReactNode;
  title: string;
}

export default function Dashboard({ children, title }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setSidebarCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('sidebar-toggle', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sidebar-toggle', handleStorage);
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <Sidebar />
      <div className={cn(
        "flex-1 min-h-screen flex flex-col transition-all duration-300",
        sidebarCollapsed ? "ml-[68px]" : "ml-64"
      )}>
        <Header title={title} />
        <main
          className="flex-1 p-6 overflow-auto transition-all duration-500 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
