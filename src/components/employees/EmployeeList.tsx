
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, User, Search, MoreHorizontal, Eye, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { EmployeeRow } from "@/types/supabase";
import EmployeeImportExport from "./EmployeeImportExport";
import { useCurrency } from "@/hooks/useCurrency";

interface EmployeeListProps { onAddEmployee?: () => void; onEditEmployee?: (id: string) => void; }

export default function EmployeeList({ onAddEmployee, onEditEmployee }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const { logEmployeeActivity } = useActivityLogger();
  const { currency } = useCurrency();

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data: employeeData, isLoading, error, refetch } = useQuery({
    queryKey: ['employees', userProfile?.company_id, searchTerm, page],
    queryFn: async () => {
      if (!userProfile?.company_id) return { rows: [], count: 0 };
      let query = supabase
        .from('employees')
        .select('*', { count: 'exact' })
        .eq('company_id', userProfile.company_id)
        .order('created_at', { ascending: false });

      if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

      const from = (page - 1) * ITEMS_PER_PAGE;
      query = query.range(from, from + ITEMS_PER_PAGE - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: data || [], count: count || 0 };
    },
    enabled: !!userProfile?.company_id,
  });

  const employees = employeeData?.rows || [];
  const totalCount = employeeData?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const handleDeleteEmployee = async (employee: EmployeeRow) => {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) return;
    try {
      const { error } = await supabase.from('employees').delete().eq('id', employee.id);
      if (error) throw error;
      await logEmployeeActivity('delete', employee.name, { employee_id: employee.id, rank: employee.rank, wage_rate: employee.wage_rate, deleted_at: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee deleted successfully");
    } catch (error: any) { console.error("Error deleting employee:", error); toast.error("Failed to delete employee"); }
  };

  const formatCurrency = (amount: number) => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount); }
    catch { return `${currency || 'USD'} ${amount.toLocaleString()}`; }
  };

  const summary = useMemo(() => {
    const active = employees.filter((employee) => employee.status === 'active').length;
    const inactive = employees.length - active;
    const payroll = employees.reduce((sum, employee) => sum + Number(employee.wage_rate || 0), 0);

    return {
      active,
      inactive,
      payroll,
    };
  }, [employees]);

  if (isLoading) {
    return (<div className="space-y-4">{[...Array(5)].map((_, i) => (<Card key={i} className="glass-card"><CardContent className="p-4"><div className="flex items-center gap-4"><Skeleton className="w-10 h-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div><Skeleton className="h-4 w-20" /></div></CardContent></Card>))}</div>);
  }

  if (error) { return (<Card className="border border-border bg-card"><CardContent className="p-6 text-center"><p className="text-destructive">Error loading employees</p></CardContent></Card>); }

  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Employees</p>
                <p className="text-sm font-normal text-muted-foreground">Professional workforce directory and actions</p>
              </div>
            </div>

            {userProfile?.is_admin && (
              <div className="flex items-center gap-2">
                {onAddEmployee && (
                  <Button onClick={onAddEmployee} className="rounded-xl h-10 px-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Showing</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{employees.length}</p>
              <p className="text-xs text-muted-foreground mt-1">of {totalCount} employees</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Status split</p>
              <p className="text-sm text-foreground mt-1">
                <span className="font-semibold">{summary.active}</span> active · <span className="font-semibold">{summary.inactive}</span> inactive
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Visible payroll</p>
              <p className="text-sm font-semibold text-foreground mt-1">{formatCurrency(summary.payroll)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search employees</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by employee name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 rounded-xl"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {userProfile?.is_admin && (
        <EmployeeImportExport onImportComplete={() => refetch()} employees={employees} />
      )}

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <User className="h-5 w-5 text-primary" />
            Team Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-muted/20">
              <p className="text-base font-medium text-foreground">No employees found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? "Try another search term or clear the filter." : "Add your first employee to start building your team."}
              </p>
              {userProfile?.is_admin && onAddEmployee && !searchTerm && (
                <Button onClick={onAddEmployee} className="mt-4 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Employee
                </Button>
              )}
            </div>
          ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-background">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]">Avatar</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead>
                  {userProfile?.is_admin && <TableHead>Wage Rate</TableHead>}
                  <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell><Avatar><AvatarFallback>{employee.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar></TableCell>
                    <TableCell className="font-medium text-primary hover:underline cursor-pointer" onClick={() => navigate(`/employees/${employee.id}`)}>{employee.name}</TableCell>
                    <TableCell><Badge variant="secondary">{employee.rank}</Badge></TableCell>
                    {userProfile?.is_admin && <TableCell>{formatCurrency(employee.wage_rate)}</TableCell>}
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/employees/${employee.id}`)}><Eye className="mr-2 h-4 w-4" /><span>View Profile</span></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {userProfile?.is_admin && <DropdownMenuItem onClick={() => onEditEmployee?.(employee.id)}><Edit className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>}
                          {userProfile?.is_admin && <DropdownMenuItem onClick={() => handleDeleteEmployee(employee)}><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {totalCount > ITEMS_PER_PAGE && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
