import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Settings2, BarChart3 } from "lucide-react";
import LeaveRequestsList from "@/components/leave/LeaveRequestsList";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";
import LeaveTypesConfig from "@/components/leave/LeaveTypesConfig";
import LeaveBalanceOverview from "@/components/leave/LeaveBalanceOverview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("requests");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.is_admin;

  return (
    <Dashboard title="Leave Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Leave Management</h2>
            <p className="text-sm text-muted-foreground">Manage leave requests, types, and balances</p>
          </div>
          <Button onClick={() => setShowRequestForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Leave Request
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid mb-4 ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="requests" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="balances" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Balances
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="config" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Leave Types
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="requests">
            <LeaveRequestsList />
          </TabsContent>

          <TabsContent value="balances">
            <LeaveBalanceOverview />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="config">
              <LeaveTypesConfig />
            </TabsContent>
          )}
        </Tabs>

        <LeaveRequestForm open={showRequestForm} onOpenChange={setShowRequestForm} />
      </div>
    </Dashboard>
  );
}
