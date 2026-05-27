import { BaseResponse } from 'common/model/base-response';
import { Company } from 'common/model/company';
import api from 'hooks/api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const useHomeApi = () => {
  const _fetchBanners = () => {
    return api.POST<BaseResponse<Company>>({
      path: '/api/models/res-company/execute/get_company_banners',
      data: {},
    });
  };

  const _saveFcmToken = (_: any, { arg }: { arg: { token?: string; employeeId?: number } }) => {
    if (!arg.token || !arg.employeeId) {
      return Promise.resolve();
    }
    return api.POST({
      path: '/api/update-device-token',
      data: {
        fcm_token: arg.token,
        employee_id: arg.employeeId,
      },
    });
  };
  const { data: banners } = useSWR('/home/banners', _fetchBanners);
  const { trigger: saveFcmToken } = useSWRMutation('/home/save-fcm-token', _saveFcmToken);

  return {
    banners,
    saveFcmToken,
  };
};
