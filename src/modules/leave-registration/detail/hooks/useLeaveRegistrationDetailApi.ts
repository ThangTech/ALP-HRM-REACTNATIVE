import { LeaveButtonType } from 'common/enum/leave-registration-status';
import { LeaveRegistration } from 'common/model/leave-registration';
import api from 'hooks/api';
import useSWR, { mutate, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { LeaveRegistrationDetailState } from '../LeaveRegistrationDetailState';
import { BaseResponse } from 'common/model/base-response';
import { ApprovalProgress } from 'common/model/approval_progress';
import { CreationModel } from 'common/model/creation-model';

export interface UseLeaveRegistrationDetailApiReturn {
  leaveDetailSwr: SWRResponse<LeaveRegistration | undefined, any, any>;
  updateLeaveRegistrationSwr: SWRMutationResponse<
    void,
    any,
    'get_hr_leave_details',
    Partial<LeaveRegistration>
  >;
  histories?: BaseResponse<ApprovalProgress>;
  createDateInfo?: BaseResponse<CreationModel>;
}

export const useLeaveRegistrationDetailApi = (
  state: LeaveRegistrationDetailState,
): UseLeaveRegistrationDetailApiReturn => {
  const fetchLeaveDetail = async (): Promise<LeaveRegistration | undefined> => {
    if (!state.id) {
      return;
    }
    try {
      const res = await api.POST({
        path: '/api/models/hr-leave/execute/get_hr_leave_details',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
      return res.data.records[0];
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const _fetchHistory = async (): Promise<BaseResponse<ApprovalProgress> | undefined> => {
    if (!state.id) {
      return;
    }
    try {
      const res = await api.POST<BaseResponse<ApprovalProgress>>({
        path: '/api/models/hr-leave/execute/get_hr_leave_approval_progress',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
      return res;
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_set_to_cancel',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleConfirmRefuse = async (reason: string) => {
    try {
      await api.POST<BaseResponse<LeaveRegistration>>({
        path: '/api/models/hr-leave/execute/create_or_update_hr_leave',
        data: {
          kwargs: {
            id: state.id,
            reject_reason: reason,
          },
        },
      });
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_reject',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };
  const handleApprove = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_accept',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_submit',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleConfirmMoveToDraft = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_set_to_draft',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleChangeStatus = async (_: string, { arg }: { arg: Partial<LeaveRegistration> }) => {
    if (arg.action === LeaveButtonType.APPROVAL_ACCEPT) {
      await handleApprove();
    } else if (arg.action === LeaveButtonType.APPROVAL_REJECT) {
      await handleConfirmRefuse(arg.reject_reason ?? '');
    } else if (arg.action === LeaveButtonType.ACTION_CANCEL) {
      await handleConfirmCancel();
    } else if (arg.action === LeaveButtonType.APPROVAL_SET_TO_DRAFT) {
      await handleConfirmMoveToDraft();
    } else if (arg.action === LeaveButtonType.APPROVAL_SUBMIT) {
      await handleConfirmSubmit();
    }
    mutate((key) => Array.isArray(key) && key[0] === 'get_list_leaves');
  };

  const _fetchCreateDate = () => {
    return api.POST<BaseResponse<CreationModel>>({
      path: '/api/models/hr-leave/execute/get_create_date_infor',
      data: {
        kwargs: {
          rec_id: state.id,
        },
      },
    });
  };

  const leaveDetailSwr = useSWR(['get_hr_leave_details', state.id], fetchLeaveDetail);

  const updateLeaveRegistrationSwr = useSWRMutation('get_hr_leave_details', handleChangeStatus);

  const { data: histories } = useSWR(['get_hr_leave_approval_progress', state.id], _fetchHistory);

  const { data: createDateInfo } = useSWR(
    state.id ? ['hr-leave/execute/get_create_date_infor', state.id] : null,
    _fetchCreateDate,
  );

  return {
    leaveDetailSwr,
    updateLeaveRegistrationSwr,
    histories,
    createDateInfo,
  };
};
