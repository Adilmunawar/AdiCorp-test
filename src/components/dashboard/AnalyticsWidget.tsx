import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Calendar, DollarSign, Sparkles } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { useState } from "react";

const COLORS = ['hsl(168, 65%, 38%)', 'hsl(142, 76%, 36%)', 'hsl(280, 87%, 65%)', 'hsl(45, 93%, 47%)', 'hsl(346, 77%, 49%)'];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  color: 'hsl(var(--foreground))',
  boxShadow: '0 8px 32px -4px hsl(var(--foreground) / 0.1)',
  padding: '12px 16px',
};

export default function AnalyticsWidget() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("attendance");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', userProfile?.company_id],
    queryFn: async () => {
      if (!userProfile?.company_id) return null;

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        return format(startOfDay(date), 'yyyy-MM-dd');
      });

      const { data: attendanceData } = await supabase
        .from('attendance')
        .select(`date, status, employees!inner(company_id)`)
        .eq('employees.company_id', userProfile.company_id)
        .gte('date', last30Days[0])
        .lte('date', last30Days[last30Days.length - 1]);

      const { data: employeesData } = await supabase
        .from('employees')
        .select('rank, wage_rate, status')
        .eq('company_id', userProfile.company_id)
        .eq('status', 'active');

      const attendanceTrends = last30Days.map(date => {
        const dayAttendance = attendanceData?.filter(a => a.date === date) || [];
        return {
          date: format(new Date(date), 'MMM dd'),
          present: dayAttendance.filter(a => a.status === 'present').length,
          absent: dayAttendance.filter(a => a.status === 'absent').length,
          leave: dayAttendance.filter(a => a.status === 'leave').length,
        };
      });

      const salaryByRank = employeesData?.reduce((acc: any, emp) => {
        const rank = emp.rank || 'Unassigned';
        if (!acc[rank]) acc[rank] = { rank, totalWage: 0, count: 0 };
        acc[rank].totalWage += Number(emp.wage_rate);
        acc[rank].count += 1;
        return acc;
      }, {});

      const salaryDistribution = Object.values(salaryByRank || {}).map((item: any) => ({
        rank: item.rank,
        avgWage: Math.round(item.totalWage / item.count),
        employees: item.count,
      }));

      const last7Days = last30Days.slice(-7);
      const weeklyData = last7Days.map(date => {
        const dayAttendance = attendanceData?.filter(a => a.date === date) || [];
        const totalEmployees = employeesData?.length || 1;
        const presentCount = dayAttendance.filter(a => a.status === 'present').length;
        return {
          day: format(new Date(date), 'EEE'),
          rate: Math.round((presentCount / totalEmployees) * 100),
        };
      });

      return { attendanceTrends, salaryDistribution, weeklyData };
    },
    enabled: !!userProfile?.company_id,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) return null;

  const tabs = [
    { value: "attendance", label: "Attendance", icon: Calendar },
    { value: "salary", label: "Salary", icon: DollarSign },
    { value: "performance", label: "Performance", icon: Users },
  ];

  return (
    <Card className="border border-border bg-card shadow-lg overflow-hidden group/card hover:shadow-xl hover:border-primary/15 transition-all duration-500">
      {/* Accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-foreground">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover/card:bg-primary/15 group-hover/card:scale-105">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold">Analytics Overview</span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">Real-time workforce insights</p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-foreground">30-Day Attendance Trends</h3>
                <div className="flex items-center gap-3">
                  {[
                    { label: "Present", color: COLORS[1] },
                    { label: "Absent", color: COLORS[4] },
                    { label: "Leave", color: COLORS[2] },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-[10px] text-muted-foreground font-medium">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.attendanceTrends}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[4]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={COLORS[4]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="present" stroke={COLORS[1]} strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                  <Area type="monotone" dataKey="absent" stroke={COLORS[4]} strokeWidth={2} fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
                  <Area type="monotone" dataKey="leave" stroke={COLORS[2]} strokeWidth={2} fillOpacity={1} fill="url(#colorLeave)" name="Leave" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4">
            <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-sm font-bold text-foreground mb-5">Salary Distribution by Rank</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.salaryDistribution} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="rank" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="avgWage" fill={COLORS[0]} radius={[8, 8, 0, 0]} name="Avg Wage" />
                  <Bar dataKey="employees" fill={COLORS[2]} radius={[8, 8, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-sm font-bold text-foreground mb-5">Weekly Attendance Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" unit="%" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[0], r: 5, strokeWidth: 3, stroke: "hsl(var(--card))" }}
                    activeDot={{ r: 8, stroke: COLORS[0], strokeWidth: 2, fill: "hsl(var(--card))" }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
