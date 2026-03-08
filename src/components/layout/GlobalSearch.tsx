
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Users, Calendar, Settings, DollarSign, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult { id: string; title: string; subtitle?: string; type: 'employee' | 'page' | 'feature'; action: () => void; icon: React.ComponentType<any>; }

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => { const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300); return () => clearTimeout(timer); }, [searchQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(o => !o); } if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", down); return () => document.removeEventListener("keydown", down);
  }, []);

  const fetchEmployees = useCallback(async (query: string = "") => {
    if (!userProfile?.company_id) return;
    setLoading(true);
    try {
      let q = supabase.from('employees').select('id, name, rank, status').eq('company_id', userProfile.company_id).eq('status', 'active').limit(8);
      if (query) q = q.ilike('name', `%${query}%`);
      const { data, error } = await q;
      if (error) throw error;
      setEmployees(data || []);
    } catch { setEmployees([]); } finally { setLoading(false); }
  }, [userProfile?.company_id]);

  useEffect(() => { if (open) fetchEmployees(debouncedQuery); }, [open, debouncedQuery, fetchEmployees]);

  const navigationItems: SearchResult[] = useMemo(() => [
    { id: 'dashboard', title: 'Dashboard', subtitle: 'Overview and statistics', type: 'page', action: () => navigate('/dashboard'), icon: TrendingUp },
    { id: 'employees', title: 'Employees', subtitle: 'Manage employee data', type: 'page', action: () => navigate('/employees'), icon: Users },
    { id: 'attendance', title: 'Attendance', subtitle: 'Track daily attendance', type: 'page', action: () => navigate('/attendance'), icon: Clock },
    { id: 'salary', title: 'Salary Management', subtitle: 'Calculate and manage payroll', type: 'page', action: () => navigate('/salary'), icon: DollarSign },
    { id: 'events', title: 'Events & Holidays', subtitle: 'Manage company events', type: 'page', action: () => navigate('/events'), icon: Calendar },
    { id: 'working-days', title: 'Working Days', subtitle: 'Configure work schedules', type: 'page', action: () => navigate('/working-days'), icon: Calendar },
    { id: 'settings', title: 'Settings', subtitle: 'Application preferences', type: 'page', action: () => navigate('/settings'), icon: Settings },
  ], [navigate]);

  const employeeResults: SearchResult[] = useMemo(() => employees.map(emp => ({ id: emp.id, title: emp.name, subtitle: emp.rank, type: 'employee' as const, action: () => navigate(`/employees?search=${emp.name}`), icon: Users })), [employees, navigate]);
  const filteredNavigationItems = useMemo(() => { if (!debouncedQuery) return navigationItems; return navigationItems.filter(item => item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || item.subtitle?.toLowerCase().includes(debouncedQuery.toLowerCase())); }, [navigationItems, debouncedQuery]);
  const handleClose = useCallback(() => { setOpen(false); setSearchQuery(""); setDebouncedQuery(""); }, []);
  const handleSelect = useCallback((action: () => void) => { action(); handleClose(); }, [handleClose]);

  return (
    <>
      <Button variant="outline" className="relative w-48 md:w-64 justify-start text-sm text-muted-foreground" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search employees, pages, or features..." value={searchQuery} onValueChange={setSearchQuery} />
        <CommandList className="max-h-[400px] overflow-y-auto">
          <CommandEmpty>{loading ? <div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Searching...</div> : "No results found."}</CommandEmpty>
          {filteredNavigationItems.length > 0 && (
            <CommandGroup heading="Navigation">
              {filteredNavigationItems.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.action)} className="cursor-pointer">
                  <item.icon className="mr-3 h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{item.title}</div><div className="text-xs text-muted-foreground truncate">{item.subtitle}</div></div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {employeeResults.length > 0 && (
            <CommandGroup heading="Employees">
              {employeeResults.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.action)} className="cursor-pointer">
                  <Users className="mr-3 h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{item.title}</div><div className="text-xs text-muted-foreground truncate">{item.subtitle}</div></div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
