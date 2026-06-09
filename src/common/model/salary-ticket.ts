import { FileData } from './user-attachment';

export interface SalaryTicket {
  id: number;
  name: string;
  payslip_name: string;
  month: string;
  year: number;
  date_from: string;
  date_to: string;
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

export interface SalaryPayslipDetail {
  id: number;
  name: string;
  number: string;
  date_from: string;
  date_to: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  job_name: string;
  social_insurance_amount: number;
  total_salary: number;
  work_conversion: number;
  lcd: number;
  kpi: number;
  TPC: number;
  diligence_kpi: number;
  truylinh: number;
  real_total_salary: number;
  truythu: number;
  bhxh: number;
  tncn: number;
  doanphi: number;
  total_minus: number;
  total_received: number;
}
