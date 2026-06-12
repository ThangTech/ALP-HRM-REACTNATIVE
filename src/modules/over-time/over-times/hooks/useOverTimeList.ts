import useSWR from 'swr';
import { OverTimesState } from '../OverTimesState';
import api from 'hooks/api';
import dayjs from 'dayjs';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { OverTime } from 'common/model/over-time';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import useAppContext from 'hooks/useAppContext';
import { OptionItem } from 'components';
import { WAITING_ME } from 'configs/contansts';
import { LeaveRegistrationStatus } from 'common/enum/leave-registration-status';

export const useOverTimeListApi = (state: OverTimesState) => {
  const app = useAppContext();
  const fetchOverTimeList = () => {
    return api.POST<BaseResponse<BaseResponsePagination<OverTime>>>({
      path: '/api/models/hr-leave/execute/get_list_overtime_register',
      data: {
        kwargs: {
          offset: state.offset,
          date_from: dayjs(state.from).format('YYYY-MM-DD'),
          date_to: dayjs(state.to).format('YYYY-MM-DD'),
          state: state.state?.key,
          ...(state.state?.key === WAITING_ME
            ? {
                need_approval: true,
                state: LeaveRegistrationStatus.APPROVED_1,
              }
            : {}),
          approve_hr_leave:
            state.viewType === LeaveRegistrationViewType.APPROVE
              ? app.user?.employee_id
              : undefined,
          employee_id: state.employee?.key?.toString()?.length ? +state.employee.key : undefined,
        },
      },
    });
  };

  const { data: overTimes } = useSWR(
    [
      'overTimeList',
      state.offset,
      state.from,
      state.to,
      state.state?.key,
      state.employee?.key,
      state.triggerRefresh,
    ],
    fetchOverTimeList,
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
    overTimes,
    employeeOptions,
  };
};
