
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, AlertTriangle, CheckCircle, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WorkingTimePolicy {
  id: string; name: string; description: string; maxDailyHours: number; maxWeeklyHours: number;
  minRestBetweenShifts: number; maxConsecutiveDays: number; overtimeThreshold: number; overtimeRate: number;
  allowFlexibleHours: boolean; coreHoursStart?: string; coreHoursEnd?: string;
  minimumNoticeForScheduleChange: number; isActive: boolean; complianceStandard: string;
}

const COMPLIANCE_STANDARDS = [
  { value: 'EU_WTD', label: 'EU Working Time Directive', maxWeekly: 48, maxDaily: 8, minRest: 11 },
  { value: 'US_FLSA', label: 'US Fair Labor Standards Act', maxWeekly: 40, maxDaily: 8, minRest: 8 },
  { value: 'UK_WTR', label: 'UK Working Time Regulations', maxWeekly: 48, maxDaily: 8, minRest: 11 },
  { value: 'IN_FACTORIES', label: 'India Factories Act', maxWeekly: 48, maxDaily: 9, minRest: 12 },
  { value: 'CA_ESA', label: 'Canada Employment Standards', maxWeekly: 44, maxDaily: 8, minRest: 8 },
  { value: 'AU_FAIR_WORK', label: 'Australia Fair Work Act', maxWeekly: 38, maxDaily: 8, minRest: 10 },
];

export default function WorkingTimePolicies() {
  const [policies, setPolicies] = useState<WorkingTimePolicy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<WorkingTimePolicy | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', maxDailyHours: 8, maxWeeklyHours: 40, minRestBetweenShifts: 8,
    maxConsecutiveDays: 6, overtimeThreshold: 40, overtimeRate: 1.5, allowFlexibleHours: false,
    coreHoursStart: '09:00', coreHoursEnd: '15:00', minimumNoticeForScheduleChange: 24, complianceStandard: 'US_FLSA',
  });
  const { toast } = useToast();

  const handleComplianceStandardChange = (standard: string) => {
    const s = COMPLIANCE_STANDARDS.find(s => s.value === standard);
    if (s) setFormData(prev => ({ ...prev, complianceStandard: standard, maxWeeklyHours: s.maxWeekly, maxDailyHours: s.maxDaily, minRestBetweenShifts: s.minRest, overtimeThreshold: s.maxWeekly }));
  };

  const validatePolicy = (policy: Partial<WorkingTimePolicy>) => {
    const v = [];
    if (policy.maxDailyHours && policy.maxDailyHours > 12) v.push('Daily hours exceed safe limits (12h)');
    if (policy.maxWeeklyHours && policy.maxWeeklyHours > 60) v.push('Weekly hours exceed recommended limits (60h)');
    if (policy.minRestBetweenShifts && policy.minRestBetweenShifts < 8) v.push('Rest between shifts below minimum (8h)');
    if (policy.maxConsecutiveDays && policy.maxConsecutiveDays > 7) v.push('Consecutive days exceed safe limits (7d)');
    return v;
  };

  const handleCreatePolicy = () => {
    const violations = validatePolicy(formData);
    if (violations.length > 0) { toast({ title: "Policy Validation Warnings", description: violations.join(', '), variant: "destructive" }); return; }
    const newPolicy: WorkingTimePolicy = { id: Date.now().toString(), ...formData, isActive: true };
    if (editingPolicy) { setPolicies(prev => prev.map(p => p.id === editingPolicy.id ? { ...newPolicy, id: editingPolicy.id } : p)); toast({ title: "Policy updated!" }); }
    else { setPolicies(prev => [...prev, newPolicy]); toast({ title: "Policy created!" }); }
    resetForm();
  };

  const handleEditPolicy = (policy: WorkingTimePolicy) => {
    setFormData({ name: policy.name, description: policy.description, maxDailyHours: policy.maxDailyHours, maxWeeklyHours: policy.maxWeeklyHours, minRestBetweenShifts: policy.minRestBetweenShifts, maxConsecutiveDays: policy.maxConsecutiveDays, overtimeThreshold: policy.overtimeThreshold, overtimeRate: policy.overtimeRate, allowFlexibleHours: policy.allowFlexibleHours, coreHoursStart: policy.coreHoursStart || '09:00', coreHoursEnd: policy.coreHoursEnd || '15:00', minimumNoticeForScheduleChange: policy.minimumNoticeForScheduleChange, complianceStandard: policy.complianceStandard });
    setEditingPolicy(policy); setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', maxDailyHours: 8, maxWeeklyHours: 40, minRestBetweenShifts: 8, maxConsecutiveDays: 6, overtimeThreshold: 40, overtimeRate: 1.5, allowFlexibleHours: false, coreHoursStart: '09:00', coreHoursEnd: '15:00', minimumNoticeForScheduleChange: 24, complianceStandard: 'US_FLSA' });
    setEditingPolicy(null); setShowForm(false);
  };

  const getComplianceStatus = (policy: WorkingTimePolicy) => validatePolicy(policy).length === 0 ? 'compliant' : 'warning';

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center"><Shield className="h-5 w-5 mr-2 text-primary" />Working Time Policies & Compliance</div>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Policy'}</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Policy Name</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Standard Full-Time Policy" /></div>
              <div className="col-span-2"><Label>Compliance Standard</Label>
                <Select value={formData.complianceStandard} onValueChange={handleComplianceStandardChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COMPLIANCE_STANDARDS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label>Max Daily Hours</Label><Input type="number" min="1" max="24" step="0.5" value={formData.maxDailyHours} onChange={(e) => setFormData(prev => ({ ...prev, maxDailyHours: parseFloat(e.target.value) }))} /></div>
              <div><Label>Max Weekly Hours</Label><Input type="number" min="1" max="168" value={formData.maxWeeklyHours} onChange={(e) => setFormData(prev => ({ ...prev, maxWeeklyHours: parseInt(e.target.value) }))} /></div>
              <div><Label>Min Rest Between Shifts (hours)</Label><Input type="number" min="0" max="24" value={formData.minRestBetweenShifts} onChange={(e) => setFormData(prev => ({ ...prev, minRestBetweenShifts: parseInt(e.target.value) }))} /></div>
              <div><Label>Max Consecutive Days</Label><Input type="number" min="1" max="14" value={formData.maxConsecutiveDays} onChange={(e) => setFormData(prev => ({ ...prev, maxConsecutiveDays: parseInt(e.target.value) }))} /></div>
              <div><Label>Overtime Threshold (weekly hours)</Label><Input type="number" min="1" value={formData.overtimeThreshold} onChange={(e) => setFormData(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) }))} /></div>
              <div><Label>Overtime Rate Multiplier</Label><Input type="number" min="1" max="3" step="0.1" value={formData.overtimeRate} onChange={(e) => setFormData(prev => ({ ...prev, overtimeRate: parseFloat(e.target.value) }))} /></div>
              <div className="col-span-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe when this policy applies..." /></div>
              <div className="flex items-center space-x-2"><Switch checked={formData.allowFlexibleHours} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowFlexibleHours: checked }))} /><Label>Allow Flexible Hours</Label></div>
              {formData.allowFlexibleHours && (<>
                <div><Label>Core Hours Start</Label><Input type="time" value={formData.coreHoursStart} onChange={(e) => setFormData(prev => ({ ...prev, coreHoursStart: e.target.value }))} /></div>
                <div><Label>Core Hours End</Label><Input type="time" value={formData.coreHoursEnd} onChange={(e) => setFormData(prev => ({ ...prev, coreHoursEnd: e.target.value }))} /></div>
              </>)}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreatePolicy}>{editingPolicy ? 'Update Policy' : 'Create Policy'}</Button>
              <Button onClick={resetForm} variant="outline">Cancel</Button>
            </div>
            {(() => { const violations = validatePolicy(formData); return violations.length > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2"><AlertTriangle className="h-4 w-4 text-yellow-600" /><span className="text-yellow-600 font-medium">Policy Warnings</span></div>
                <ul className="text-sm text-yellow-600 space-y-1">{violations.map((v, i) => <li key={i}>• {v}</li>)}</ul>
              </div>
            ); })()}
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Active Policies</h3>
          {policies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><Shield className="h-12 w-12 mx-auto mb-2 opacity-50" /><p>No working time policies configured. Create your first policy above.</p></div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => {
                const status = getComplianceStatus(policy);
                const standardInfo = COMPLIANCE_STANDARDS.find(s => s.value === policy.complianceStandard);
                return (
                  <div key={policy.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-lg">{policy.name}</span>
                        <Badge variant="secondary" className={status === 'compliant' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}>
                          {status === 'compliant' ? <><CheckCircle className="h-3 w-3 mr-1" /> Compliant</> : <><AlertTriangle className="h-3 w-3 mr-1" /> Warnings</>}
                        </Badge>
                        <Badge variant="outline" className="border-primary/50 text-primary">{standardInfo?.label || policy.complianceStandard}</Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleEditPolicy(policy)}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{policy.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Daily Hours:</span><p className="font-medium">{policy.maxDailyHours}h</p></div>
                      <div><span className="text-muted-foreground">Weekly Hours:</span><p className="font-medium">{policy.maxWeeklyHours}h</p></div>
                      <div><span className="text-muted-foreground">Rest Between:</span><p className="font-medium">{policy.minRestBetweenShifts}h</p></div>
                      <div><span className="text-muted-foreground">Overtime Rate:</span><p className="font-medium">{policy.overtimeRate}x</p></div>
                    </div>
                    {policy.allowFlexibleHours && <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded"><p className="text-sm text-blue-600">🕐 Flexible Hours: Core time {policy.coreHoursStart} - {policy.coreHoursEnd}</p></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
