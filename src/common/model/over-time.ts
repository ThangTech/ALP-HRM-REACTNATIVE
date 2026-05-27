import { LeaveRegistrationPeriod } from 'common/enum/leave-registration-period';
import { LeaveButtonType, LeaveRegistrationStatus } from 'common/enum/leave-registration-status';
import { ApprovalNextStepData } from './approval_progress';
import { FileData } from './user-attachment';

export interface OverTime {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: boolean;
  job_name?: string;
  /**
   * Nếu trạng thái startWith('validate') thì là đã approved
   */
  state: LeaveRegistrationStatus;
  holiday_status_id: number;
  holiday_status_name: string;
  overtime_type: number;
  label_overtime_type: string;
  date_from: string;
  date_to: string;
  request_date_from: string;
  request_date_to: string;
  duration_display: string;
  overtime_hours: number;
  leave_hours: number;
  number_work: number;
  content: string;
  approver_name: string;
  reason: string;
  reject_reason?: string;
  resource_calendar_id: number;
  resource_calendar_name: string;
  coefficient: number;
  hours_of_break: number;
  hours_overtime: number;
  action: LeaveButtonType;
  buttons: LeaveButtonType[];
  request_unit_half: boolean;
  request_date_from_period: LeaveRegistrationPeriod;
  request_unit_hours: boolean;
  next_step_data?: ApprovalNextStepData;
  result_files?: FileData[];
}
