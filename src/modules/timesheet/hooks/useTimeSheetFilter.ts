import { BaseResponse } from 'common/model/base-response';
import { OptionItem } from 'components';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import useSWR from 'swr';

export const useTimeSheetFilter = () => {
  const { current_company_id } = useAppContext();

  const _fetchEmployee = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {
        kwargs: {
          is_working: true,
        },
        context: {
          company_id: current_company_id,
          allowed_company_ids: [current_company_id],
        },
      },
    });
    return response.data?.map((it) => ({ key: it.id.toString(), value: it.display_name })) || [];
  };

  const { data: employeeOptions } = useSWR(
    ['get_list_employee_infor', current_company_id],
    _fetchEmployee,
  );

  return { employeeOptions };
};
