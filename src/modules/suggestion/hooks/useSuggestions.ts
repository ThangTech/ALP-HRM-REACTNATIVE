import useSWR from 'swr';
import { SuggestionListState } from '../screens/SuggestionListState';
import api from 'hooks/api';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { SuggestionModel } from 'common/model/suggestion-model';

export const useSuggestions = (state: SuggestionListState) => {
  const _fetchSuggestions = async () => {
    return await api.POST<BaseResponse<BaseResponsePagination<SuggestionModel>>>({
      path: '/api/models/helpdesk-ticket/execute/get_list_helpdesk_ticket',
      data: {
        kwargs: {
          type: state.type,
          date_from: state.from,
          date_to: state.to,
          state: state.status,
          offset: state.offset,
          limit: state.limit,
        },
      },
    });
  };

  const { data: suggestions, isLoading: isLoadingSuggestions } = useSWR(
    [
      'suggestions',
      state.from,
      state.to,
      state.status,
      state.offset,
      state.limit,
      state.triggerRefresh,
    ],
    _fetchSuggestions,
  );

  return {
    suggestions: suggestions,
    isLoadingSuggestions,
  };
};
