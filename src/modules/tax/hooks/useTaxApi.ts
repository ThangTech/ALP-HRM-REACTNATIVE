import { BaseResponse } from 'common/model/base-response';
import { Tax } from 'common/model/tax';
import api from 'hooks/api';
import useSWR from 'swr';

export const useTaxApi = () => {
  const _fetchTax = async (): Promise<BaseResponse<Tax>> => {
    const response = await api.POST({
      path: '/api/models/hr-employee/execute/get_employee_taxes',
      data: {},
    });
    return response;
  };

  const { data: tax } = useSWR(['get_employee_taxes'], _fetchTax);

  return {
    tax,
  };
};
