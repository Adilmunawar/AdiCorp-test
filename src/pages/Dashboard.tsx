
import Dashboard from "@/components/layout/Dashboard";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Clock, Sparkles } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AnalyticsWidget from "@/components/dashboard/AnalyticsWidget";

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <Dashboard title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/8 via-card to-card border border-border shadow-lg group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_60%)]" />
          <div className="absolute top-4 right-4 opacity-[0.03]">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                {userProfile?.companies?.logo && (
                  <div className="relative">
                    <img 
                      src={userProfile.companies.logo} 
                      alt="Company Logo" 
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
                  </h1>
                  <p className="text-muted-foreground text-lg flex items-center gap-2">
                    {userProfile?.companies?.name ? (
                      <>
                        <span className="font-medium text-foreground">Managing</span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 transition-colors duration-200 hover:bg-primary/15">
                          {userProfile.companies.name}
                        </span>
                      </>
                    ) : (
                      'Your HR management dashboard'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-5 py-3 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium">Today</p>
                  <p className="text-sm font-semibold text-foreground">{format(new Date(), 'EEEE, MMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Analytics Widget */}
        <AnalyticsWidget />
      </div>
    </Dashboard>
  );
}
