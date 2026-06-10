import { BaseResponse } from 'common/model/base-response';
import { Company } from 'common/model/company';
import api from 'hooks/api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export interface RecentActivityRecord {
  res_name: string;
  res_id: number;
  res_model_id: number;
  res_model: string;
  model_display_name: string;
  activity_type_id: number;
  activity_type_name: string;
  summary: string;
  date_deadline: string;
}

export interface RecentActivityResponse {
  total: number;
  records: RecentActivityRecord[];
}

export const useHomeApi = () => {
  const _fetchBanners = () => {
    return api.POST<BaseResponse<Company>>({
      path: '/api/models/res-company/execute/get_company_banners',
      data: {},
    });
  };

  const _fetchRecentActivities = () => {
    return api.POST<BaseResponse<RecentActivityResponse>>({
      path: '/api/models/mail-activity/execute/get_my_recent_activities',
      data: {
        kwargs: {
          limit: 5,
        },
      },
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
  const { data: recentActivities } = useSWR('/home/recent_activities', _fetchRecentActivities);
  const { trigger: saveFcmToken } = useSWRMutation('/home/save-fcm-token', _saveFcmToken);

  return {
    banners,
    recentActivities,
    saveFcmToken,
  };
};
