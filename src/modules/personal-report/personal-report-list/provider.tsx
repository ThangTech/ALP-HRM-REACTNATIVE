import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ReactElement, createContext, useContext, useState } from 'react';
import { PersonalReportListState } from './PersonalReportListState';
import { PersonalReportType } from 'common/enum/personal-report-type';
import { usePersonalReportListApi } from './hooks/usePersonalReportListApi';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';
import { TerminationState } from 'common/enum/termination-state';
import { OptionItem } from 'components';

const PersonalReportListContext = createContext<PersonalReportListType>(null!);

interface PersonalReportListType {
  state: PersonalReportListState;
  setState: Dispatch<SetStateAction<PersonalReportListState>>;
  mapStatus: Array<OptionItem>;
}

export function usePersonalReportListProvider() {
  return useContext(PersonalReportListContext);
}

export function PersonalReportListProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<PersonalReportListState>({
    reportOptions: [
      { key: PersonalReportType.APPOINT, value: 'Bổ nhiệm' },
      { key: PersonalReportType.CONCURRENT_POSITION, value: 'Kiêm nhiệm' },
      { key: PersonalReportType.SALARY_CHANGE, value: 'Điều chỉnh lương' },
      { key: PersonalReportType.JOB_ASSIGNMENT, value: 'Phân công công việc' },
      { key: PersonalReportType.TRANSFER, value: 'Điều chuyển' },
      { key: PersonalReportType.DISMISSAL, value: 'Miễn nhiệm' },
    ],
    state: { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! },
  });
  const personalReportListApi = usePersonalReportListApi(state);

  const mapStatus = [
    { key: '', value: 'Tất cả' },
    { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! },
    { key: TerminationState.DRAFT, value: 'Dự thảo' },
    { key: TerminationState.WAITING, value: 'Chờ duyệt' },
    { key: TerminationState.APPROVED, value: 'Đã duyệt' },
    { key: TerminationState.REFUSED, value: 'Từ chối' },
    { key: TerminationState.CANCELLED, value: 'Huỷ' },
  ];

  useEffect(() => {
    const records = personalReportListApi.personalReportListSwr.data?.records ?? [];
    setState((prev) => ({
      ...prev,
      personalReports: prev.offset ? [...(prev.personalReports ?? []), ...records] : records,
    }));
  }, [personalReportListApi.personalReportListSwr.data]);
  const value = {
    state,
    setState,
    mapStatus,
  };
  return (
    <PersonalReportListContext.Provider value={value}>
      {children}
    </PersonalReportListContext.Provider>
  );
}
