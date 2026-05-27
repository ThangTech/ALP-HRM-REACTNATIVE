import { NotificationItemType } from 'common/enum/notification-item-type';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { NotificationModel, NotificationsRoot } from 'common/model/notification-model';
import api from 'hooks/api';
import useSWR from 'swr';

export const useNotifications = () => {
  const _fetchNotifications = async (): Promise<
    BaseResponse<BaseResponsePagination<NotificationModel>>
  > => {
    const response = await api.POST<BaseResponse<NotificationsRoot>>({
      path: '/api/models/hr-employee/execute/get_all_pending_approvals_mobile',
      data: {},
    });
    const records = [
      ...(response.data?.details.gtc?.map((it) => ({ ...it, type: NotificationItemType.GTC })) ??
        []),
      ...(response.data?.details.leave?.map((it) => ({
        ...it,
        type: NotificationItemType.LEAVE,
      })) ?? []),
      ...(response.data?.details.overtime?.map((it) => ({
        ...it,
        type: NotificationItemType.OVERTIME,
      })) ?? []),
      ...(response.data?.details.resignation?.map((it) => ({
        ...it,
        type: NotificationItemType.TERMINATION,
      })) ?? []),
    ];
    return { data: { total: response.data?.summary.total_all, records: records } };
  };
  const {
    data: notifications,
    isLoading,
    mutate: refresh,
  } = useSWR(['notifications'], _fetchNotifications);
  return {
    notifications,
    isLoading,
    refresh,
  };
};
