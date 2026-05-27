import { ReactElement, createContext, useContext } from 'react';

const LeaveReportDetailContext = createContext<LeaveReportDetailType>(null!);

interface LeaveReportDetailType {}

export function useLeaveReportDetailProvider() {
  return useContext(LeaveReportDetailContext);
}

export function LeaveReportDetailProvider({ children }: { children: ReactElement }) {
  const value = {};
  return (
    <LeaveReportDetailContext.Provider value={value}>{children}</LeaveReportDetailContext.Provider>
  );
}
