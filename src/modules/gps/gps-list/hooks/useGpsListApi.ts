import api from 'hooks/api';
import { GpsListState } from '../GpsListState';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { GpsModel } from 'common/model/gps-model';

export const useGpsListApi = (state: GpsListState) => {
  const _fetchGpsList = async () => {
    return api.POST<BaseResponse<BaseResponsePagination<GpsModel>>>({
      path: '/api/models/driver-attendance-log/execute/get_list_driver_attendance_log',
      data: {
        kwargs: {
          limit: state.limit,
          offset: state.offset,
          date_from: state.from ? dayjs(state.from).format('YYYY-MM-DD') : undefined,
          date_to: state.to ? dayjs(state.to).format('YYYY-MM-DD') : undefined,
        },
      },
    });
  };
  const { data: gpsList, isLoading: isLoadingGpsList } = useSWR(
    [
      'get_list_driver_attendance_log',
      state.limit,
      state.offset,
      state.from,
      state.to,
      state.triggerFetch,
    ],
    _fetchGpsList,
  );

  return {
    gpsList,
    isLoadingGpsList,
  };
};
