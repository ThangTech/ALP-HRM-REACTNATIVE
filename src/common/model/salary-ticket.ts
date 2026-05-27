import { FileData } from './user-attachment';

export interface SalaryTicket {
  id: number;
  name: string;
  payslip_name: string;
  month: string;
  year: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  standard_work: number;
  total_work: number;
  trial_overtime_hours: number;
  official_overtime_hours: number;
  negotiable_income: number;
  actual_negotiable_income: number;
  total_salary: number;
  total_bonus: number;
  total_other_allowance: number;
  total_month_income: number;
  tax_cal_total: number;
  total_minus: number;
  total_received: number;
  hold_salary: number;
  actual_spent: number;
  files: FileData[];
}
