
import { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import EmployeeList from "@/components/employees/EmployeeList";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

const EmployeesPage = () => {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | undefined>(undefined);
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const handleAddEmployee = () => {
    setEditEmployeeId(undefined);
    setShowEmployeeForm(true);
  };
  
  const handleEditEmployee = (id: string) => {
    setEditEmployeeId(id);
    setShowEmployeeForm(true);
  };
  
  const handleCloseForm = () => {
    setShowEmployeeForm(false);
    setEditEmployeeId(undefined);
  };

  const handleSuccess = () => {
    setShowEmployeeForm(false);
    setEditEmployeeId(undefined);
  };

  if (!userProfile?.company_id) {
    return (
      <Dashboard title="Employees Management">
        <div className="max-w-xl mx-auto py-10">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary inline-flex items-center justify-center mb-4">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Complete company setup first</h2>
            <p className="text-muted-foreground mt-2">Set up your company profile to unlock employee management features.</p>
            <Button variant="outline" className="mt-5 rounded-xl" onClick={() => navigate('/settings')}>
              Go to Settings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Dashboard>
    );
  }
  
  return (
    <Dashboard title="Employees Management">
      <EmployeeList 
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleEditEmployee}
      />
      
      {showEmployeeForm && (
        <EmployeeForm 
          isOpen={showEmployeeForm}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
          employeeId={editEmployeeId}
        />
      )}
    </Dashboard>
  );
};

export default EmployeesPage;
