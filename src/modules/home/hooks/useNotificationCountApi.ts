import { BaseResponse } from 'common/model/base-response';
import { NotificationsMeta } from 'common/model/notification-model';
import api from 'hooks/api';
import useSWR from 'swr';

export const useNotificationCountApi = () => {
  const _fetchCount = async (): Promise<BaseResponse<NotificationsMeta>> => {
    const response = await api.POST({
      path: '/api/models/hr-employee/execute/get_pending_approvals_count_only',
      data: {},
    });
    return response;
  };

  const { data: notificationCount, mutate: refresh } = useSWR('notificationCount', _fetchCount);

  return {
    notificationCount,
    refresh,
  };
};
