import api from 'hooks/api';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import useAppContext from 'hooks/useAppContext';

export interface ApprovalItem {
  id: number;
  name: string;
  code: string;
  request_status: string;
  request_status_label: string;
  employee_id: number | false;
  employee_name: string;
  employee_code: string;
  category_id: {
    id: number;
    name: string;
    code: string;
  };
  company_id: {
    id: number;
    name: string;
  };
}

interface UseApprovalListParams {
  request_status?: string;
  date_start?: string;
  date_end?: string;
  category_id?: number;
  limit?: number;
}

const useApprovalList = (params: UseApprovalListParams = {}) => {
  const app = useAppContext();
  const { request_status, date_start, date_end, category_id, limit = 20 } = params;

  const getKey = (pageIndex: number, previousPageData: ApprovalItem[] | null) => {
    if (previousPageData && previousPageData.length === 0) {
      return null;
    }

    const filters: Record<string, any> = {
      offset: pageIndex * limit,
      limit,
    };

    if (request_status && request_status !== 'all') {
      filters.request_status = request_status;
    }
    if (date_start) {
      filters.date_start = date_start;
    }
    if (date_end) {
      filters.date_end = date_end;
    }
    if (category_id) {
      filters.category_id = category_id;
    }

    return ['approvalList', filters, app.current_company_id];
  };

  const fetcher = async ([_key, filters]: [string, any]) => {
    try {
      const res = await api.POST({
        path: '/api/models/approval-request/execute/get_approval_requests',
        data: {
          kwargs: filters,
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      if (res?.data?.records) {
        return res.data.records as ApprovalItem[];
      }
      return [];
    } catch (err) {
      console.log('Error fetching approval list:', err);
      return [];
    }
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<ApprovalItem[]>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const approvalList = useMemo(() => {
    if (!data) {
      return [];
    }
    const flatData = data.flat();
    return flatData.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
  }, [data]);

  const isLoadingInitial = !data && !error;
  const isLoadingMore =
    isLoadingInitial || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && (data[data.length - 1]?.length ?? 0) < limit);

  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const refresh = async () => {
    setSize(1);
    await mutate();
  };

  return [
    {
      get approvalList() {
        return approvalList;
      },
      get isLoading() {
        return isLoadingInitial;
      },
      get isLoadingMore() {
        return isLoadingMore;
      },
      get isReachingEnd() {
        return isReachingEnd;
      },
      get isRefreshing() {
        return isValidating && size === 1;
      },
    },
    {
      loadMore,
      refresh,
    },
  ] as const;
};

export default useApprovalList;
