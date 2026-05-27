import { TerminationButtonType } from 'common/enum/termination-button-type';
import { TerminationState } from 'common/enum/termination-state';
import { FileData } from './user-attachment';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import { ApprovalNextStepData } from './approval_progress';

export interface UploadImageTerminationParams {
  resId: number;
  files: UploadedFile[];
}

export interface Termination {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  departure_reason_id: number;
  departure_reason_name: string;
  resignation_date: string;
  day_off: string;
  state: TerminationState;
  label_state: string;
  contract_id: number;
  contract_name: string;
  division_name: string;
  department_name: string;
  group_name: string;
  job_name: string;
  parent_name: string;
  content: string;
  receiver_employee_id: number;
  receiver_employee_name: string;
  information: string;
  note: string;
  reject_reason: string;
  button: TerminationButtonType;
  buttons: TerminationButtonType[];
  files: FileData[];
  next_step_data?: ApprovalNextStepData;
}
