import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import { useCallback, useState } from 'react';

export interface EmployeeListItem {
  id: number;
  name: string;
  display_name: string;
  employee_code: string;
}

export const useEmployeeListApi = () => {
  const { current_company_id } = useAppContext();
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployeeList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.POST<{ data: EmployeeListItem[] }>({
        path: '/api/models/hr-employee/execute/get_list_employee_infor',
        data: {
          context: {
            company_id: current_company_id,
            allowed_company_ids: [current_company_id],
          },
        },
      });
      setEmployees(res?.data ?? []);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [current_company_id]);

  return {
    fetchEmployeeList,
    employees,
    loading,
    error,
  };
};
