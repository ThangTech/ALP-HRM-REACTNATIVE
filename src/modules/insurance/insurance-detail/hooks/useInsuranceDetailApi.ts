import { InsuranceType } from 'common/enum/insurance-type';
import { BaseResponse } from 'common/model/base-response';
import { Insurance, InsuranceOther } from 'common/model/insurance';
import api from 'hooks/api';
import useSWR from 'swr';

export const useInsuranceDetailApi = (type?: InsuranceType) => {
  const _fetchInsuranceDetail = async () => {
    if (type !== InsuranceType.SOCIAL) {
      return;
    }
    const response = await api.POST<BaseResponse<Insurance>>({
      path: '/api/models/hr-employee/execute/get_employee_social_insurance',
      data: {},
    });
    return response.data;
  };
  const _fetchInsuranceHealthDetail = async () => {
    if (type !== InsuranceType.HEALTH) {
      return;
    }
    const response = await api.POST<BaseResponse<InsuranceOther>>({
      path: '/api/models/hr-employee/execute/get_employee_health_insurance',
      data: {},
    });
    return response.data;
  };

  const { data: insuranceDetail } = useSWR('get_employee_social_insurance', _fetchInsuranceDetail);
  const { data: insuranceHealthDetail } = useSWR(
    'get_employee_health_insurance',
    _fetchInsuranceHealthDetail,
  );

  return {
    insuranceDetail,
    insuranceHealthDetail,
  };
};
