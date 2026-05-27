import api from 'hooks/api';
import { PersonalReportListState } from '../PersonalReportListState';
import useSWR from 'swr';
import { PersonalReport } from 'common/model/personal-report';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { WAITING_ME } from 'configs/contansts';
import { TerminationState } from 'common/enum/termination-state';

export const usePersonalReportListApi = (state: PersonalReportListState) => {
  const personalReportFetcher = async (): Promise<
    BaseResponsePagination<PersonalReport> | undefined
  > => {
    if (!state.type) {
      return;
    }
    const response = await api.POST<BaseResponse<BaseResponsePagination<PersonalReport>>>({
      path: '/api/models/staff-transfer/execute/get_staff_transfer',
      data: {
        kwargs: {
          offset: state.offset,
          limit: state.limit ?? 20,
          type: state.type.key,
          approve_staff_transfer: state.approveStaffTransfer,
          state: state.state?.key,
          ...(state.state?.key === WAITING_ME
            ? {
                need_approval: true,
                state: TerminationState.WAITING,
              }
            : {}),
        },
      },
    });
    return response.data;
  };

  const personalReportListSwr = useSWR(
    [
      'get_staff_transfer',
      state.offset,
      state.limit,
      state.type?.key,
      state.approveStaffTransfer,
      state.triggerRefresh,
      state.state,
    ],
    personalReportFetcher,
  );
  return {
    personalReportListSwr,
  };
};
