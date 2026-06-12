import { BaseResponse } from 'common/model/base-response';
import { OptionItem } from 'components';
import api from 'hooks/api';
import { useState, useCallback, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import useAppContext from 'hooks/useAppContext';

export type ViolationTabType = 'department' | 'group' | 'job' | 'employee' | 'manager';

export interface ViolationEmployee {
  employee_id: number;
  employee_code: string;
  employee_name: string;
  department: string;
  group: string;
  total_late: number;
  total_early: number;
  total_missing: number;
  total_violations: number;
}

export interface ViolationDetail {
  attendance_date: string;
  check_in: string;
  check_out: string;
  late: boolean;
  early: boolean;
  is_missing_check: boolean;
}

const EMPTY_ARRAY: any[] = [];

const TODAY = new Date();

const extractArrayData = <T>(res: any): T[] => {
  return Array.isArray(res?.data) ? res.data : EMPTY_ARRAY;
};

const extractErrorMessage = (res: any): string | null => {
  if (res?.data?.message && typeof res.data.message === 'string') return res.data.message;
  if (res?.message && typeof res.message === 'string') return res.message;
  return null;
};

export const useAttendanceViolationPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkPermission = async () => {
      setIsLoading(true);
      try {
        const res = await api.POST<any>({
          path: '/api/models/hr-attendance/execute/get_attendance_violation_report',
          data: {
            kwargs: { month: TODAY.getMonth() + 1, year: TODAY.getFullYear(), limit: 1 },
          },
        });
        if (isMounted) {
          setHasPermission(Array.isArray(res?.data));
        }
      } catch (error) {
        if (isMounted) {
          setHasPermission(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  return { hasPermission, isLoading };
};

const useAttendanceViolation = () => {
  const app = useAppContext();
  const [month, setMonth] = useState(TODAY.getMonth() + 1);
  const [year, setYear] = useState(TODAY.getFullYear());
  const [activeTab, setActiveTab] = useState<ViolationTabType>('manager');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');

  const handleTabChange = useCallback((tab: ViolationTabType) => {
    setActiveTab(tab);
    setSelectedIds([]);
  }, []);

  //Dropdown options
  const { data: departmentOptions } = useSWR<OptionItem[]>(
    activeTab === 'department' ? ['get_infor_employee_department'] : null,
    async () => {
      const res = await api.POST<{ data: { id: number; name: string }[] }>({
        path: '/api/models/hr-department/execute/get_infor_employee_department',
        data: {
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return res.data?.map((d) => ({ key: d.id.toString(), value: d.name })) || [];
    },
  );

  const { data: groupOptions } = useSWR<OptionItem[]>(
    activeTab === 'group' ? ['get_infor_employee_group'] : null,
    async () => {
      const res = await api.POST<{ data: { id: number; name: string }[] }>({
        path: '/api/models/sv-employee-group/execute/get_infor_employee_group',
        data: {
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return res.data?.map((g) => ({ key: g.id.toString(), value: g.name })) || [];
    },
  );

  const { data: jobOptions } = useSWR<OptionItem[]>(
    activeTab === 'job' ? ['get_infor_job'] : null,
    async () => {
      const res = await api.POST<{ data: { id: number; name: string }[] }>({
        path: '/api/models/hr-job/execute/get_infor_job',
        data: {
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return res.data?.map((g) => ({ key: g.id.toString(), value: g.name })) || [];
    },
  );

  const { data: employeeOptions } = useSWR<OptionItem[]>(
    activeTab === 'employee' ? ['get_employee_list_violation', app.current_company_id] : null,
    async () => {
      const res = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
        path: '/api/models/hr-employee/execute/get_list_employee_infor',
        data: {
          kwargs: { is_working: true },
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return res.data?.map((e) => ({ key: e.id.toString(), value: e.display_name })) || [];
    },
  );

  //Employee violation list
  const {
    data: violationListData,
    isValidating: isValidatingViolationList,
    error: violationListError,
  } = useSWR<{ data: ViolationEmployee[] } | { message: string } | null>(
    selectedIds.length > 0 || activeTab === 'manager'
      ? ['get_attendance_violation_report', month, year, activeTab, ...selectedIds]
      : null,
    async () => {
      const kwargs: Record<string, any> = { month, year, limit: 1000 };
      if (activeTab === 'manager') {
        kwargs.manager = true;
      } else if (activeTab === 'department') {
        kwargs.department_ids = selectedIds;
      } else if (activeTab === 'group') {
        kwargs.group_ids = selectedIds;
      } else if (activeTab === 'job') {
        kwargs.job_ids = selectedIds;
      } else {
        kwargs.employee_ids = selectedIds;
      }
      const res = await api.POST<any>({
        path: '/api/models/hr-attendance/execute/get_attendance_violation_report',
        data: { kwargs },
      });
      return res;
    },
    { revalidateIfStale: false },
  );

  // Loading ở render đầu tiên
  const isViolationListPending =
    (selectedIds.length > 0 || activeTab === 'manager') &&
    !violationListData &&
    !violationListError;

  const violationEmployees = extractArrayData<ViolationEmployee>(violationListData);
  const violationListAccessError = extractErrorMessage(violationListData);

  // Lọc theo searchText
  const filteredEmployees = useMemo(() => {
    if (!searchText) return violationEmployees;
    const lowerSearch = searchText.toLowerCase();
    return violationEmployees.filter(
      (e: ViolationEmployee) =>
        e.employee_name.toLowerCase().includes(lowerSearch) ||
        e.employee_code.toLowerCase().includes(lowerSearch),
    );
  }, [searchText, violationEmployees]);

  return {
    month,
    year,
    setMonth,
    setYear,
    activeTab,
    handleTabChange,
    selectedIds,
    setSelectedIds,
    searchText,
    setSearchText,
    // dropdown options
    departmentOptions: departmentOptions || EMPTY_ARRAY,
    groupOptions: groupOptions || EMPTY_ARRAY,
    jobOptions: jobOptions || EMPTY_ARRAY,
    employeeOptions: employeeOptions || EMPTY_ARRAY,

    // employee list
    filteredEmployees,
    isLoadingViolationList: isViolationListPending || isValidatingViolationList,
    violationListError,
    violationListAccessError,
  };
};

export const useAttendanceViolationDetail = (params: {
  employeeId: number;
  month: number;
  year: number;
}) => {
  const { employeeId, month, year } = params;

  const {
    data: rawData,
    isValidating,
    error,
  } = useSWR<{ data: ViolationDetail[] } | { message: string }>(
    ['get_attendance_violation_details', employeeId, month, year],
    async () => {
      const res = await api.POST<any>({
        path: '/api/models/hr-attendance/execute/get_attendance_violation_details',
        data: { kwargs: { month, year, employee_id: employeeId } },
      });
      return res;
    },
    { revalidateIfStale: false },
  );

  const violations = extractArrayData<ViolationDetail>(rawData);
  const accessError = extractErrorMessage(rawData);
  const isLoadingDetail = (!rawData && !error) || isValidating;

  const totalLate = useMemo(
    () => violations.filter((v: ViolationDetail) => v.late).length,
    [violations],
  );
  const totalEarly = useMemo(
    () => violations.filter((v: ViolationDetail) => v.early).length,
    [violations],
  );
  const totalMissing = useMemo(
    () => violations.filter((v: ViolationDetail) => v.is_missing_check).length,
    [violations],
  );

  return {
    violations,
    accessError,
    isLoadingDetail,
    totalLate,
    totalEarly,
    totalMissing,
  };
};

export default useAttendanceViolation;
