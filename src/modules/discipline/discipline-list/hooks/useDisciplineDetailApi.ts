import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import { DisciplineListState } from '../DisciplineListState';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { Discipline } from 'common/model/discipline';
import useSWR from 'swr';

export const useDisciplineDetailApi = (state: DisciplineListState) => {
  const app = useAppContext();

  const _fetchList = async () => {
    const response = await api.POST<BaseResponse<BaseResponsePagination<Discipline>>>({
      path: '/api/models/reward-discipline/execute/get_list_reward_discipline',
      data: {
        kwargs: {
          offset: state.offset || 0,
          limit: 20,
          type: state.disciplineType?.key,
        },
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    const disciplines: Discipline[] = [];
    for (let it of response.data?.records ?? []) {
      disciplines.push(Discipline.fromJson(it));
    }
    return {
      ...response.data,
      records: disciplines,
    };
  };
  const { data: disciplineList, mutate: refresh } = useSWR(
    [['get_list_reward_discipline', state.offset, state.disciplineType, app.current_company_id]],
    _fetchList,
  );

  return {
    disciplineList,
    refresh,
  };
};
