import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeaveTypesConfig() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "other" as string, days_per_year: 0, is_paid: true });

  const { data: leaveTypes, isLoading } = useQuery({
    queryKey: ["leave-types", userProfile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("leave_types").select("*").eq("company_id", userProfile!.company_id!).order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
  });

  const handleCreate = async () => {
    if (!formData.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from("leave_types").insert({
        company_id: userProfile!.company_id!,
        name: formData.name,
        type: formData.type as any,
        days_per_year: formData.days_per_year,
        is_paid: formData.is_paid,
      });
      if (error) throw error;
      toast({ title: "Leave type created" });
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
      setShowForm(false);
      setFormData({ name: "", type: "other", days_per_year: 0, is_paid: true });
    } catch (error: any) {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("leave_types").update({ is_active: !current }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["leave-types"] });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Leave Types Configuration</CardTitle>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2"><Plus className="h-4 w-4" />Add Type</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveTypes?.map((lt: any) => (
              <div key={lt.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{lt.name}</p>
                    <Badge variant="outline" className="text-xs capitalize">{lt.type}</Badge>
                    {lt.is_paid && <Badge className="text-xs bg-green-500/10 text-green-700 border-green-500/20" variant="outline">Paid</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{lt.days_per_year} days/year</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Active</Label>
                    <Switch checked={lt.is_active} onCheckedChange={() => toggleActive(lt.id, lt.is_active)} />
                  </div>
                </div>
              </div>
            ))}
            {(!leaveTypes || leaveTypes.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No leave types configured. Add your first leave type above.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Leave Type</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Annual Leave" /></div>
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["annual", "sick", "unpaid", "maternity", "paternity", "other"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Days Per Year</Label><Input type="number" value={formData.days_per_year} onChange={(e) => setFormData({...formData, days_per_year: Number(e.target.value)})} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_paid} onCheckedChange={(v) => setFormData({...formData, is_paid: v})} />
              <Label>Paid Leave</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
