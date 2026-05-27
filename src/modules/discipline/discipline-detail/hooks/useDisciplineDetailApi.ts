import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { Discipline } from 'common/model/discipline';
import api from 'hooks/api';
import useSWR from 'swr';
import { DisciplineDetailState } from '../DisciplineDetailState';

export const useDisciplineDetailApi = (state: DisciplineDetailState) => {
  const _fetchDetail = async () => {
    if (!state.id) {
      return undefined;
    }
    const response = await api.POST<BaseResponse<BaseResponsePagination<Discipline>>>({
      path: '/api/models/reward-discipline/execute/get_reward_discipline_details',
      data: {
        kwargs: {
          id: state.id,
        },
      },
    });
    return Discipline.fromJson(response.data?.records?.at(0) ?? {});
  };
  const { data: disciplineDetail, mutate: refresh } = useSWR(
    ['get_reward_discipline_details', state.id],
    _fetchDetail,
  );

  return {
    disciplineDetail,
    refresh,
  };
};
