import api from 'hooks/api';
import useSWRInfinite from 'swr/infinite';
import { useMemo, useCallback, useState } from 'react';
import useAppContext from 'hooks/useAppContext';
export type SignFilterType = 'my' | 'all';
export type StateFilter = 'sent' | 'signed';
export type SignRequestState = 'sent' | 'signed' | 'canceled';

export interface SignRequestItem {
  id: number;
  partner_name: string;
  state: SignRequestState;
}

export interface SignAttachment {
  attachment_id: number;
  name: string;
  mimetype: string;
  url: string;
  url_download: string;
}

export interface SignAttachedDocument {
  id: number;
  name: string;
  note: string;
  request_id: number;
  attachments: SignAttachment[];
}

export interface SignRequest {
  id: number;
  reference: string;
  state: SignRequestState;
  progress: number;
  create_date: string;
  sign_url: string;
  request_item_ids: SignRequestItem[];
  attached_documents: SignAttachedDocument[];
}

export interface SignRequestSummary {
  filter_type: SignFilterType;
  state: string;
  total_count: number;
  count_waiting: number;
  count_signed: number;
  count_canceled: number;
  limit: number;
  offset: number;
  current_page_items_count: number;
}

export interface SignRequestApiResponse {
  data: {
    summary: SignRequestSummary;
    sign_requests: SignRequest[];
  };
}
const LIMIT = 50;

export const useSignRequests = (filterType: SignFilterType) => {
  const app = useAppContext();
  const [stateFilter, setStateFilter] = useState<StateFilter | undefined>(undefined);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: SignRequest[] | null) => {
      if (previousPageData && previousPageData.length < LIMIT) return null;

      return [
        'get_mobile_sign_requests',
        {
          filter_type: filterType,
          ...(stateFilter && { state: stateFilter }),
          offset: pageIndex * LIMIT,
          limit: LIMIT,
        },
        app.current_company_id,
      ];
    },
    [filterType, stateFilter, app.current_company_id],
  );

  const fetcher = async ([_key, filters]: [string, any]) => {
    try {
      const res = await api.POST({
        path: '/api/models/sign-request/execute/get_mobile_sign_requests',
        data: {
          kwargs: filters,
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return (res.data?.sign_requests ?? []) as SignRequest[];
    } catch (err) {
      console.log('Error fetching sign requests:', err);
      return [] as SignRequest[];
    }
  };

  const { data, size, setSize, isValidating, mutate, isLoading } = useSWRInfinite<SignRequest[]>(
    getKey,
    fetcher,
    { revalidateFirstPage: false, revalidateOnFocus: false },
  );

  const signRequests = useMemo(() => {
    if (!data) return [];
    return data.flat();
  }, [data]);

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data && (data[data.length - 1]?.length ?? 0) < LIMIT;

  const loadMore = useCallback(() => {
    setSize((s) => s + 1);
  }, [setSize]);

  const refresh = useCallback(async () => {
    setSize(1);
    await mutate();
  }, [mutate, setSize]);

  const changeStateFilter = useCallback(
    (filter: StateFilter | undefined) => {
      setStateFilter(filter);
      setSize(1);
    },
    [setSize],
  );

  return {
    signRequests,
    stateFilter,
    isLoading,
    isLoadingMore: !!isLoadingMore,
    isReachingEnd: !!isReachingEnd,
    isRefreshing: isValidating && size === 1,
    loadMore,
    refresh,
    mutate,
    changeStateFilter,
  };
};
