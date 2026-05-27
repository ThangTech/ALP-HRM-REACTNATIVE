/* eslint-disable react-hooks/exhaustive-deps */
import { LeaveRegistrationStatus } from 'common/enum/leave-registration-status';
import { OptionItem } from 'components';
import dayjs from 'dayjs';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLeaveRegistrationsApi } from './hooks/useLeaveRegistrationApi';
import { LeaveRegistrationState } from './LeaveRegistrationState';
import { Holiday } from 'common/model/leave-registration';
import { WAITING_ME } from 'configs/contansts';
import { MAP_STATUS } from 'configs/contansts';

const LeaveRegistrationsContext = createContext<LeaveRegistrationsType>(null!);

interface LeaveRegistrationsType {
  state: LeaveRegistrationState;
  setState: Dispatch<SetStateAction<LeaveRegistrationState>>;
  statusMap: OptionItem[];
  employeeOptions?: OptionItem[];
  holidays: Holiday[];
  isLoading: boolean;
}

export function useLeaveRegistrationsProvider() {
  return useContext(LeaveRegistrationsContext);
}

export function LeaveRegistrationsProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<LeaveRegistrationState>({
    fromDate: dayjs().startOf('month').toDate(),
    toDate: dayjs().endOf('month').toDate(),
    status: { key: '', value: 'Tất cả' } as OptionItem,
    limit: 20,
    employee: { key: '', value: 'Tất cả' } as OptionItem,
  });
  const leaveRegistrationApi = useLeaveRegistrationsApi(state);
  const leavePagination = leaveRegistrationApi.listFetcher.data;

  const statusMap = useMemo(
    () => [
      { key: '', value: 'Tất cả' } as OptionItem,
      { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME) } as OptionItem,
      { key: LeaveRegistrationStatus.PENDING, value: 'Dự thảo' } as OptionItem,
      { key: LeaveRegistrationStatus.APPROVED_1, value: 'Chờ duyệt' } as OptionItem,
      { key: LeaveRegistrationStatus.APPROVED, value: 'Đã duyệt' } as OptionItem,
      { key: LeaveRegistrationStatus.REJECTED, value: 'Từ chối' } as OptionItem,
      { key: LeaveRegistrationStatus.CANCELLED, value: 'Huỷ' } as OptionItem,
    ],
    [],
  );

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      items: !state.offset
        ? leavePagination?.records
        : [...(prev.items ?? []), ...(leavePagination?.records ?? [])],
    }));
  }, [leavePagination?.records]);

  const value = {
    state,
    setState,
    statusMap,
    holidays: leaveRegistrationApi.leaveOverview?.records ?? [],
    isLoading: leaveRegistrationApi.listFetcher.isLoading,
    employeeOptions: leaveRegistrationApi.employeeOptions,
  };
  return (
    <LeaveRegistrationsContext.Provider value={value}>
      {children}
    </LeaveRegistrationsContext.Provider>
  );
}
