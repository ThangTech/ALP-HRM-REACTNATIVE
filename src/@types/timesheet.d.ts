interface TimeKeeping {
  attendance_date: string;
  check_in: string;
  check_out: string;
  late_minutes: number;
  early_leave_minutes: number;
  work_normal: number;
  actual_resource_calendar_id: string;
  actual_resource_calendar_name: string;
  actual_resource_calendar_display_name: string;
}

interface AttendanceRecord {
  state: string;
  check_in: string;
  check_out: string;
  late_minutes: number;
  early_leave_minutes: number;
  work_normal: number;
  actual_resource_calendar_id: number | string;
  actual_resource_calendar_name: string;
  actual_resource_calendar_display_name: string;
}

interface AttendanceList {
  [date: string]: AttendanceRecord;
}

interface AttendanceSummary {
  total_work?: number;
  standard_work?: number;
  count_missing_check?: number;
  count_late?: number;
  count_early?: number;
  recog_overtime_hours?: number;
  salary_hours?: number;
  overtime_leave_hours?: number;
}

interface ApprovalNextStepData {
  next_step_id: number;
  next_step_name: string;
  next_description: string;
}

interface TimesheetExplanationList {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  explanation_date: string;
  state: string;
  label_state: string;
  explanation_reason: string;
  explanation_reason_label: string;
  // Thông tin thêm cho admin approval
  department_name?: string;
  division_name?: string;
  job_title?: string;
  next_step_data?: ApprovalNextStepData;
}

interface TimesheetExplanationDetail {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  division_name: string;
  department_name: string;
  group_name: string;
  job_name: string;
  explanation_reason: string;
  explanation_reason_label: string;
  explanation_date: string;
  state: string;
  label_state: string;
  is_trial_day: boolean;
  day_type: string;
  day_type_label: string;
  allocation: string;
  allocation_label: string;
  actual_resource_calendar_id: number;
  actual_resource_calendar_name: string;
  actual_check_in: string;
  actual_check_out: string;
  actual_work: number;
  explained_resource_calendar_id: number;
  explained_resource_calendar_name: string;
  work_time_from: number;
  work_time_to: number;
  working_from?: string;
  working_to?: string;
  arrive_start_time: string;
  arrive_end_time: string;
  leave_start_time: string;
  leave_end_time: string;
  move_time_in_work: number;
  move_time_out_work: number;
  move_time: number;
  explained_check_in: string;
  explained_check_out: string;
  explanation_work: number;
  work_address: string;
  late_minutes: number;
  early_leave_minutes: number;
  overtime_first_start: string;
  overtime_first_end: string;
  overtime_second_start: string;
  overtime_second_end: string;
  hours_of_break: number | string;
  number_minutes: number;
  coefficient: number | string;
  late?: boolean;
  early?: boolean;
  overtime_hours: number;
  overtime_hours_convert: number;
  is_holiday: number;
  timeoff_hours: number;
  allocated_buffer_hours: number;
  salary_hours: number;
  buttons: ['approval_accept', 'approval_reject', 'cancel', 'approval_submit', 'draft'];
  x_approval_btn: number;
  exp_name?: string | false;
  reject_reason?: string;
  files: fileType[];
  targetState?: TerminationState;
  next_step_data?: ApprovalNextStepData;
  autoFillExplainedDate?: boolean;
  autoFillCoefficient?: boolean;
  autoFillHoursOfBreak?: boolean;
  is_missing_check?: boolean;
  late_or_early?: boolean;
  address_explanation_ids?: any[];
  move_time_in_salary?: number;
  work_time_from?: number;
  work_time_to?: number;
}

interface fileType {
  id: number;
  name: string;
  mimetype: string; //sample-local-pdf.pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document or image/png or .....
  download_url: string;
  file_size?: number;
}

interface ExplanationReasonType {
  key: string;
  value: string;
}

interface CalculateInformation {
  id?: number;
  name: string;
  employee_id: number;
  employee_name?: string;
  employee_code?: string;
  company_id: number;
  company_name: string;
  division_id: number;
  division_name: string;
  department_id: number;
  department_name: string;
  group_id: number;
  group_name: string;
  job_id: number;
  job_name?: string;
  explanation_reason: string;
  explanation_reason_label: string;
  exp_name?: string;
  explanation_date: string;
  is_trial_day: boolean;
  day_type: string;
  day_type_label: string;
  allocation: string;
  allocation_label: string;
  actual_resource_calendar_id: number;
  actual_resource_calendar_display_name: string;
  actual_check_in: string;
  actual_check_out: string;
  actual_work: number;
  explained_resource_calendar_id: number;
  explained_resource_calendar_display_name: string;
  work_time_from: number;
  work_time_to: number;
  arrive_start_time: string;
  arrive_end_time: string;
  leave_start_time: string;
  leave_end_time: string;
  move_time_in_work: number;
  move_time_out_work: number;
  move_time: number;
  explained_check_in?: string;
  explained_check_out?: string;
  explanation_work: number;
  work_address: string;
  late_minutes: number;
  early_leave_minutes: number;
  overtime_first_start: string;
  overtime_first_end: string;
  overtime_second_start: string;
  overtime_second_end: string;
  hours_of_break?: number | string;
  number_minutes: number;
  coefficient?: number | string;
  overtime_hours: number;
  overtime_hours_convert: number;
  is_holiday: number;
  timeoff_hours: number;
  allocated_buffer_hours?: number;
  salary_hours?: number;
  address_explanation_ids?: any[];
  move_time_in_salary?: number;
  state?: string;
  state_label: string;
}
