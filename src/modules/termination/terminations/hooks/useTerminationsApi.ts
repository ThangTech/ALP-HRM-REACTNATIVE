import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { Termination } from 'common/model/termination';
import { OptionItem } from 'components';
import api from 'hooks/api';
import useSWR from 'swr';
import useAppContext from 'hooks/useAppContext';
import { TerminationsState } from '../TerminationsState';
import dayjs from 'dayjs';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { WAITING_ME } from 'configs/contansts';
import { TerminationState } from 'common/enum/termination-state';

export const useTerminationsApi = (state: TerminationsState) => {
  const app = useAppContext();
  const departmentFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/hr-department/execute/get_infor_employee_department',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const groupFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/sv-division/execute/get_infor_employee_division',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const terminationsFetcher = async (): Promise<BaseResponsePagination<Termination>> => {
    const res = await api.POST({
      path: '/api/models/resignation-letter/execute/get_resignation_letter',
      data: {
        kwargs: {
          limit: 20,
          offset: state.offset,
          department_id: state.department?.key,
          division_id: state.group?.key,
          state: state.status?.key,
          ...(state.status?.key === WAITING_ME
            ? {
                need_approval: true,
                state: TerminationState.WAITING,
              }
            : {}),
          date_from: state.requestDate ? dayjs(state.requestDate).format('YYYY-MM-DD') : undefined,
          date_to: state.requestDateTo
            ? dayjs(state.requestDateTo).format('YYYY-MM-DD')
            : undefined,
          employee_id: state.employee?.key ? +state.employee.key : undefined,
          approve_resignation_letter: state.viewType === LeaveRegistrationViewType.APPROVE,
        },
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    return res.data;
  };

  const departmentSwr = useSWR(['get_infor_employee_department'], departmentFetcher);
  const groupSwr = useSWR(['get_infor_employee_division'], groupFetcher);
  const terminationsSwr = useSWR(
    [
      'get_resignation_letter',
      state.offset,
      state.requestDate,
      state.department,
      state.group,
      state.status,
      state.triggerRefresh,
      state.employee?.key,
    ],
    terminationsFetcher,
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
    departmentSwr,
    groupSwr,
    terminationsSwr,
    employeeOptions,
  };
};
