

# Full Feature Implementation Plan

## Summary

Based on the backend-frontend gap analysis, there are 5 major features with backend tables ready but no frontend UI, plus additional improvements to add. Here is the complete plan.

---

## Phase 1: Leave Management System

**Backend tables ready:** `leave_types`, `leave_requests`, `leave_balances`

**New files to create:**
- `src/pages/LeaveManagement.tsx` -- Main page with tabs for Requests, Types Config, Balances
- `src/components/leave/LeaveRequestForm.tsx` -- Modal form to submit a leave request (employee select, leave type, date range, reason)
- `src/components/leave/LeaveRequestsList.tsx` -- Table of all leave requests with status badges, approve/reject actions for admins
- `src/components/leave/LeaveTypesConfig.tsx` -- Admin UI to create/edit leave types (annual, sick, casual, etc.) with days_per_year and is_paid toggle
- `src/components/leave/LeaveBalanceOverview.tsx` -- Grid cards showing each employee's leave balances (total, used, remaining) per type

**Changes:**
- Add `/leave-management` route in `App.tsx`
- Add "Leave Management" nav item to `Sidebar.tsx` under a new "HR" group
- Initialize leave balances when a new year starts or when leave types are configured

---

## Phase 2: Overtime Tracking System

**Backend tables ready:** `overtime_records`, `overtime_config`, `tier_config`

**New files to create:**
- `src/pages/Overtime.tsx` -- Main overtime page with tabs for Records, Config
- `src/components/overtime/OvertimeEntryForm.tsx` -- Form to log overtime (employee, date, hours, type: regular/weekend/holiday, reason). Auto-calculates multiplier and total from tier_config
- `src/components/overtime/OvertimeRecordsList.tsx` -- Table with pending/approved/rejected filter, approve/reject actions for admins
- `src/components/overtime/OvertimeConfigPanel.tsx` -- Admin panel to edit overtime_config (multipliers, max hours, requires_approval toggle)

**Changes:**
- Add `/overtime` route in `App.tsx`
- Add "Overtime" nav item to `Sidebar.tsx` under "Finance" group
- **Integrate overtime into salary calculations** in `useSalaryData.ts` and `dataIntegrationService.ts` -- fetch approved overtime_records for the month, sum overtime_earnings, add to gross salary

---

## Phase 3: Employee Document Manager

**Backend ready:** `employee_documents` table + `employee-documents` storage bucket

**New files to create:**
- `src/components/employees/DocumentManager.tsx` -- Upload/view/download/delete documents per employee. Supports document types: contract, id_copy, certificate, resume, other. Shows file size, upload date, uploaded_by
- `src/hooks/useDocuments.ts` -- Hook for CRUD operations on employee_documents + Supabase Storage upload/download

**Changes:**
- Add a "Documents" tab to `EmployeeProfile.tsx` with the DocumentManager component
- Wire up file upload to `employee-documents` storage bucket with proper paths (`{company_id}/{employee_id}/{filename}`)

---

## Phase 4: Payslip Persistence & History

**Backend table ready:** `payslips`

**Changes to existing files:**
- `src/hooks/useSalaryData.ts` -- Add a `generatePayslips()` function that saves calculated salary data (including overtime) to the `payslips` table
- `src/pages/Salary.tsx` -- Add a "Generate & Save Payslips" button that persists current month's calculations
- `src/components/salary/PayslipHistory.tsx` (new) -- View previously generated payslips by month, with download capability
- Add a "History" tab to the Salary page showing saved payslips from the database

---

## Phase 5: Additional New Features

### 5a. Employee Shift Management Enhancement
- `src/components/settings/ShiftManagement.tsx` already exists -- enhance it to support shift assignment per employee and display shift info on attendance page

### 5b. Dashboard Widgets for New Features
- Add leave summary widget to Dashboard (pending requests count, upcoming leaves)
- Add overtime summary widget (total overtime hours this month, pending approvals)
- Add document compliance widget (employees missing required documents)

### 5c. Notification System Enhancement
- `src/components/layout/NotificationDropdown.tsx` -- Wire up real notifications for: leave request submitted/approved/rejected, overtime approved/rejected, payslips generated

### 5d. Employee Profile Enhancement
- Add leave balance cards to employee profile
- Add overtime history tab to employee profile
- Show document compliance status

---

## Routing & Navigation Updates

Add to `App.tsx`:
```
/leave-management -> LeaveManagement
/overtime -> Overtime
```

Update `Sidebar.tsx` nav groups:
```
HR: Leave Management
Finance: Salary, Overtime, Reports
```

---

## Implementation Order

1. Leave Management (largest feature, most backend-ready)
2. Overtime Tracking + Salary Integration
3. Document Manager
4. Payslip Persistence
5. Dashboard widgets & profile enhancements
6. Notification wiring

Each phase is independent and can be built incrementally. No database migrations needed -- all tables and RLS policies already exist.

