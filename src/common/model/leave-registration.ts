import { HolidayCode } from 'common/enum/holiday-code';
import { HolidayUnit } from 'common/enum/holiday-unit';
import { LeaveRegistrationPeriod } from 'common/enum/leave-registration-period';
import { LeaveButtonType, LeaveRegistrationStatus } from 'common/enum/leave-registration-status';

export interface LeaveRegistration {
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
  date_from: string;
  date_to: string;
  request_date_from: string;
  request_date_to: string;
  duration_display: string;
  leave_hours: number;
  number_work: number;
  content: string;
  approver_name: string;
  reject_reason?: string;
  reason: string;
  action: LeaveButtonType;
  buttons: LeaveButtonType[];
  request_unit_half: boolean;
  request_date_from_period: LeaveRegistrationPeriod;
  request_unit_hours: boolean;
  next_step_data?: ApprovalNextStepData;
}

export interface Holiday {
  holiday_status_id: number;
  holiday_status_name: string;
  days_remaining?: number;
  code?: HolidayCode;
  total_allocated?: number;
  used_days?: number;
  remaining_days?: number;
  used_hours?: number;
  remaining_hours?: number;
  unit?: HolidayUnit;
}
