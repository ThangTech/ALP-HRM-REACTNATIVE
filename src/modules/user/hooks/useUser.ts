import api from 'hooks/api';
import useSWR from 'swr';

const useUser = (employeeId?: number) => {
  const employeeKwargs = employeeId ? { kwargs: { employee_id: employeeId } } : {};

  const { data: dataEmployeeTree, error: errorEmployeeTree } = useSWR(
    ['employeeTree', employeeId],
    async () => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-employee/execute/get_org_chart',
          data: employeeKwargs,
        });
        return res;
      } catch (error: any) {
        console.log(error.message);
      }
    },
  );

  const { data: dataContract, error: errorContract } = useSWR<Contract>(
    ['contract', employeeId],
    async () => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-contract/execute/get_contract_infor',
          data: employeeKwargs,
        });
        return res.data;
      } catch (error: any) {
        console.log(error.message);
      }
    },
  );

  const { data: userApprovalInfor } = useSWR<UserApprovalInfor>(
    ['userApprovalInfor', employeeId],
    async () => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-employee/execute/get_approval_infor',
          data: {},
        });
        return res.data;
      } catch (error: any) {
        console.log(error.message);
      }
    },
  );

  return [
    {
      get dataEmployeeTree() {
        return dataEmployeeTree;
      },
      get errorEmployeeTree() {
        return errorEmployeeTree;
      },
      get dataContract() {
        return dataContract;
      },
      get errorContract() {
        return errorContract;
      },
      get userApprovalInfor() {
        return userApprovalInfor;
      },
    },
    {},
  ] as const;
};

export default useUser;
