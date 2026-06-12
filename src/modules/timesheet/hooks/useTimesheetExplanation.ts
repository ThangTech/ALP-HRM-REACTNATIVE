import api from 'hooks/api';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { OptionItem } from 'components';
import { BaseResponse } from 'common/model/base-response';
import useSWR from 'swr';
import useAppContext from 'hooks/useAppContext';
import { WAITING_ME } from 'configs/contansts';

interface UseTimesheetExplanationParams {
  dateFrom?: string; // Format: YYYY-MM-DD
  dateTo?: string; // Format: YYYY-MM-DD
  state?: string; // 'all', 'pending', 'approved', 'rejected'
  limit?: number;
  approve_hr_attendance_explanation?: boolean; // For admin approval tab
  employee_id?: string;
}

const useTimesheetExplanation = (params: UseTimesheetExplanationParams = {}) => {
  const app = useAppContext();
  const {
    dateFrom,
    dateTo,
    state,
    limit = 15,
    approve_hr_attendance_explanation,
    employee_id,
  } = params;
  const getKey = (pageIndex: number, previousPageData: TimesheetExplanationList[] | null) => {
    // Reached the end
    if (previousPageData && previousPageData.length === 0) {
      return null;
    }

    // Create unique key based on filters
    const filters = {
      offset: pageIndex * limit,
      limit,
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo }),
      ...(state && state === WAITING_ME && { need_approval: true, state: 'waiting' }),
      ...(state && state !== 'all' && state !== WAITING_ME && { state }),
      ...(employee_id && employee_id !== 'all' && { employee_id: +employee_id }),
      ...(approve_hr_attendance_explanation && { approve_hr_attendance_explanation }),
    };

    return ['timesheetExplanationList', filters];
  };

  const fetcher = async ([_key, filters]: [string, any]) => {
    try {
      const res = await api.POST({
        path: '/api/models/hr-attendance-explanation/execute/get_attendance_explanation',
        data: {
          kwargs: filters,
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      if (res?.data.records) {
        return res.data.records;
      }
      return [];
    } catch (err) {
      console.log('Error fetching timesheet explanation:', err);
      // Return empty array instead of throwing to prevent infinite loop
      return [];
    }
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<
    TimesheetExplanationList[]
  >(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  });

  // Flatten the paginated data and remove duplicates by ID
  const timesheetExplanationList = useMemo(() => {
    if (!data) {
      return [];
    }

    const flatData = data.flat();
    // Remove duplicates by ID
    const uniqueData = flatData.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
    return uniqueData;
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

  const _fetchEmployee = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });

    const options = [{ key: 'all', value: 'Tất cả' }];

    options.push(
      ...(response.data?.map((it) => ({ key: it.id.toString(), value: it.display_name })) || []),
    );
    return options;
  };
  const { data: employeeOptions } = useSWR(
    ['get_list_employee_infor', app.current_company_id],
    _fetchEmployee,
  );

  return [
    {
      get timesheetExplanationList() {
        return timesheetExplanationList;
      },
      get errorTimesheetExplanationList() {
        return error;
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
      get employeeOptions() {
        return employeeOptions;
      },
    },
    {
      loadMore,
      refresh,
    },
  ] as const;
};

export default useTimesheetExplanation;
