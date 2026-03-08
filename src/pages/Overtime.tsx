import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Settings2 } from "lucide-react";
import OvertimeRecordsList from "@/components/overtime/OvertimeRecordsList";
import OvertimeEntryForm from "@/components/overtime/OvertimeEntryForm";
import OvertimeConfigPanel from "@/components/overtime/OvertimeConfigPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OvertimePage() {
  const [activeTab, setActiveTab] = useState("records");
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.is_admin;

  return (
    <Dashboard title="Overtime Tracking">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Overtime Tracking</h2>
            <p className="text-sm text-muted-foreground">Track and manage employee overtime hours</p>
          </div>
          <Button onClick={() => setShowEntryForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Log Overtime
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid mb-4 ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="records" className="gap-2"><Clock className="h-4 w-4" />Records</TabsTrigger>
            {isAdmin && <TabsTrigger value="config" className="gap-2"><Settings2 className="h-4 w-4" />Configuration</TabsTrigger>}
          </TabsList>

          <TabsContent value="records"><OvertimeRecordsList /></TabsContent>
          {isAdmin && <TabsContent value="config"><OvertimeConfigPanel /></TabsContent>}
        </Tabs>

        <OvertimeEntryForm open={showEntryForm} onOpenChange={setShowEntryForm} />
      </div>
    </Dashboard>
  );
}
