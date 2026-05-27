import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TerminationsState } from './TerminationsState';
import { TerminationState } from 'common/enum/termination-state';
import { useTerminationsApi } from './hooks/useTerminationsApi';
import { OptionItem } from 'components';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';
import dayjs from 'dayjs';

const TerminationsContext = createContext<TerminationsType>(null!);

interface TerminationsType {
  state: TerminationsState;
  setState: Dispatch<SetStateAction<TerminationsState>>;
  employeeOptions?: OptionItem[];
}

export function useTerminationsProvider() {
  return useContext(TerminationsContext);
}

export function TerminationsProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<TerminationsState>({
    offset: 0,
    status: { key: '', value: 'Tất cả' },
    employee: { key: '', value: 'Tất cả' },
    requestDate: dayjs().startOf('month').toDate(),
    requestDateTo: dayjs().endOf('month').toDate(),
    statusOptions: [
      { key: '', value: 'Tất cả' },
      { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! },
      { key: TerminationState.DRAFT, value: 'Dự thảo' },
      { key: TerminationState.WAITING, value: 'Chờ duyệt' },
      { key: TerminationState.APPROVED, value: 'Đã duyệt' },
      { key: TerminationState.REFUSED, value: 'Từ chối' },
      { key: TerminationState.CANCELLED, value: 'Huỷ' },
    ],
  });
  const terminationApi = useTerminationsApi(state);

  useEffect(() => {
    const groupOptions = [{ key: '', value: 'Tất cả' }, ...(terminationApi.groupSwr.data ?? [])];
    const departmentOptions = [
      { key: '', value: 'Tất cả' },
      ...(terminationApi.departmentSwr.data ?? []),
    ];
    setState((prev) => ({
      ...prev,
      group: groupOptions.at(0),
      department: departmentOptions.at(0),
      groupOptions: groupOptions,
      departmentOptions: departmentOptions,
    }));
  }, [terminationApi.groupSwr.data, terminationApi.departmentSwr.data]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      terminations: prev.offset
        ? [...(prev.terminations ?? []), ...(terminationApi.terminationsSwr.data?.records ?? [])]
        : terminationApi.terminationsSwr.data?.records,
    }));
  }, [terminationApi.terminationsSwr.data]);

  const value = {
    state,
    setState,
    employeeOptions: terminationApi.employeeOptions,
  };
  return <TerminationsContext.Provider value={value}>{children}</TerminationsContext.Provider>;
}
