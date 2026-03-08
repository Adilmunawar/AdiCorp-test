
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Users, Calendar, DollarSign, TrendingUp, Clock, UserCheck } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/hooks/useCurrency";

export default function DashboardStats() {
  const { userProfile } = useAuth();
  const { currency } = useCurrency();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userProfile?.company_id],
    queryFn: async () => {
      if (!userProfile?.company_id) return null;

      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, wage_rate, status')
        .eq('company_id', userProfile.company_id);

      if (employeesError) throw employeesError;

      const { data: todayAttendance, error: attendanceError } = await supabase
        .from('attendance')
        .select(`id, employee_id, employees!inner(company_id)`)
        .eq('employees.company_id', userProfile.company_id)
        .gte('date', startOfToday.toISOString().split('T')[0])
        .lte('date', endOfToday.toISOString().split('T')[0]);

      if (attendanceError) throw attendanceError;

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: monthlyAttendance, error: monthlyError } = await supabase
        .from('attendance')
        .select(`id, employees!inner(company_id)`)
        .eq('employees.company_id', userProfile.company_id)
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (monthlyError) throw monthlyError;

      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;
      const totalWageRate = employees?.reduce((sum, emp) => sum + emp.wage_rate, 0) || 0;
      const todayAttendanceCount = todayAttendance?.length || 0;
      const monthlyAttendanceCount = monthlyAttendance?.length || 0;
      const attendanceRate = activeEmployees > 0 ? Math.round((todayAttendanceCount / activeEmployees) * 100) : 0;

      return { totalEmployees, activeEmployees, todayAttendance: todayAttendanceCount, monthlyAttendance: monthlyAttendanceCount, totalWageRate, attendanceRate };
    },
    enabled: !!userProfile?.company_id,
  });

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: currency || 'USD',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency || 'USD'} ${amount.toLocaleString()}`;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-5">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: "Total Employees", value: stats.totalEmployees, description: `${stats.activeEmployees} active`, icon: Users, accent: "from-teal-500/10 to-emerald-500/10" },
    { title: "Today's Attendance", value: stats.todayAttendance, description: `${stats.attendanceRate}% rate`, icon: UserCheck, accent: "from-blue-500/10 to-cyan-500/10" },
    { title: "Monthly Attendance", value: stats.monthlyAttendance, description: "This month", icon: Calendar, accent: "from-violet-500/10 to-purple-500/10" },
    { title: "Wage Budget", value: formatCurrency(stats.totalWageRate), description: "Combined rates", icon: DollarSign, accent: "from-green-500/10 to-lime-500/10" },
    { title: "Current Date", value: format(new Date(), "MMM dd"), description: format(new Date(), "yyyy"), icon: Clock, accent: "from-orange-500/10 to-amber-500/10" },
    { title: "Attendance Rate", value: `${stats.attendanceRate}%`, description: "Today", icon: TrendingUp, accent: "from-pink-500/10 to-rose-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-border overflow-hidden group cursor-default transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
            <CardContent className="p-5 relative">
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
