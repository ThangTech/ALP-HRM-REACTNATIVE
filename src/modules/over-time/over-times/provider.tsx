import React, { useEffect } from 'react';
import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { OverTimesState } from './OverTimesState';
import { OverTime } from 'common/model/over-time';
import { useOverTimeListApi } from './hooks/useOverTimeList';
import dayjs from 'dayjs';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { LeaveRegistrationStatus } from 'common/enum/leave-registration-status';
import { OptionItem } from 'components';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';

const OverTimesContext = createContext<OverTimesType>(null!);

interface OverTimesType {
  state: OverTimesState;
  setState: Dispatch<SetStateAction<OverTimesState>>;
  overTimes?: OverTime[];
  employeeOptions?: OptionItem[];
}

export function useOverTimesProvider() {
  return useContext(OverTimesContext);
}

export function OverTimesProvider({
  children,
  viewType,
}: {
  children: ReactElement;
  viewType?: LeaveRegistrationViewType;
}) {
  const [state, setState] = useState<OverTimesState>({
    offset: 0,
    state:
      viewType === LeaveRegistrationViewType.APPROVE
        ? { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! }
        : { key: '', value: 'Tất cả' },
    from: dayjs().startOf('month').toDate(),
    to: dayjs().endOf('month').toDate(),
    viewType: viewType,
    stateOptions: [
      { key: '', value: 'Tất cả' },
      { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! },
      { key: LeaveRegistrationStatus.PENDING, value: 'Dự thảo' },
      { key: LeaveRegistrationStatus.APPROVED_1, value: 'Chờ duyệt' },
      { key: LeaveRegistrationStatus.APPROVED, value: 'Đã duyệt' },
      { key: LeaveRegistrationStatus.REJECTED, value: 'Từ chối' },
      { key: LeaveRegistrationStatus.CANCELLED, value: 'Huỷ' },
    ],
  });
  const overTimesApi = useOverTimeListApi(state);

  useEffect(() => {
    const records = overTimesApi?.overTimes?.data?.records ?? [];
    setState((prev) => ({
      ...prev,
      items: !state.offset ? records : [...(prev.items ?? []), ...records],
    }));
  }, [overTimesApi?.overTimes?.data?.records, state.offset]);

  const value = {
    state,
    setState,
    employeeOptions: overTimesApi.employeeOptions,
  };
  return <OverTimesContext.Provider value={value}>{children}</OverTimesContext.Provider>;
}
