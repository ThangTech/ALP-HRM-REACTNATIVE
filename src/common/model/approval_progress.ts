import { ApprovalStatusCode } from 'common/enum/approval-status-code';

export interface ApprovalProgress {
  next_step_data?: ApprovalNextStepData;
  approval_steps?: ApprovalStepData[];
  approval_progress?: ApprovalProgressItem[];
}

export interface ApprovalProgressItem {
  id?: number;
  step_approval_id?: number;
  step_name?: string;
  description?: string;
  status_code?: ApprovalStatusCode;
  status_label?: string;
  approved_by_id?: number;
  approved_by_name?: string;
}

/**
 * "next_step_data": {
            "next_step_id": 4,
            "next_step_name": "C&B phụ trách",
            "next_description": "C&B phụ trách"
        }
 */
export interface ApprovalNextStepData {
  next_step_id: number;
  next_step_name: string;
  next_description: string;
}

/**
 *                 "step_approval_id": 421,
                "step_approval_name": "Phó phòng_Phòng Kế hoạch Điều phối",
                "approve_user_id": 0,
                "approval_user_name": "",
                "description": "Bước duyệt hiện tại"
 */
export interface ApprovalStepData {
  step_approval_id: number;
  step_approval_name: string;
  approve_user_id: number;
  approval_user_name: string;
  description: string;
}
