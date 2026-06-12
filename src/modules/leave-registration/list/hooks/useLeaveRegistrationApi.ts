import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import dayjs from 'dayjs';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import useSWR from 'swr';
import { LeaveRegistrationState } from '../LeaveRegistrationState';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { Holiday, LeaveRegistration } from 'common/model/leave-registration';
import { OptionItem } from 'components';
import { WAITING_ME } from 'configs/contansts';
import { LeaveRegistrationStatus } from 'common/enum/leave-registration-status';

export const useLeaveRegistrationsApi = (state: LeaveRegistrationState) => {
  const app = useAppContext();

  const listFetcher = useSWR(
    [
      'get_list_leaves',
      state.fromDate,
      state.toDate,
      state.status?.key,
      state.viewType,
      state.limit,
      state.offset,
      state.triggerRefresh,
      state.employee?.key,
      app.user?.employee_id,
    ],
    async (): Promise<BaseResponsePagination<LeaveRegistration>> => {
      try {
        if (!state.viewType) {
          return { records: [], total: -1 };
        }

        const offset = state.offset || 0;
        // if (offset > (state.total ?? 0)) { return { records: [], total: -1 } }
        const res = await api.POST({
          path: '/api/models/hr-leave/execute/get_list_leaves',
          data: {
            kwargs: {
              offset: offset,
              limit: state.limit,
              state:
                state.status?.key && state.status.key !== WAITING_ME ? state.status.key : undefined,
              ...(state.status?.key === WAITING_ME
                ? {
                    need_approval: true,
                    state: LeaveRegistrationStatus.APPROVED_1,
                  }
                : {}),
              employee_id: state.employee?.key ? +state.employee.key : undefined,
              date_from: dayjs(state.fromDate).format('YYYY-MM-DD'),
              date_to:
                state.viewType === LeaveRegistrationViewType.APPROVE
                  ? dayjs(state.toDate).format('YYYY-MM-DD')
                  : undefined,
              // approve_hr_leave get from api profile
              approve_hr_leave:
                state.viewType === LeaveRegistrationViewType.APPROVE
                  ? app.user?.employee_id
                  : undefined,
            },
            context: {
              company_id: app.current_company_id,
              allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
            },
          },
        });
        return res.data;
      } catch (err) {
        console.log('Error fetching timesheet explanation:', err);
        throw err;
      }
    },
  );

  const { data: leaveOverview } = useSWR(
    ['get_holiday_details_by_type'],
    async (): Promise<BaseResponsePagination<Holiday> | undefined> => {
      const res = await api.POST<BaseResponse<BaseResponsePagination<Holiday>>>({
        path: '/api/models/hr-leave/execute/get_holiday_details_by_type',
        data: {},
      });
      return res.data;
    },
  );
  const _fetchEmployee = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });

    const options = [{ key: '', value: 'Tất cả' }];

    options.push(
      ...(response.data?.map((it) => ({ key: it.id.toString(), value: it.display_name })) || []),
    );
    return options;
  };
  const { data: employeeOptions } = useSWR(
    ['get_list_employee_infor', app.current_company_id],
    _fetchEmployee,
  );

  return {
    listFetcher,
    leaveOverview,
    employeeOptions,
  };
};
