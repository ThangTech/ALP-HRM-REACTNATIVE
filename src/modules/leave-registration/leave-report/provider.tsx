import React, { ReactElement, createContext, useContext } from 'react';

const LeaveReportContext = createContext<LeaveReportType>(null!);

interface LeaveReportType {}

export function useLeaveReportProvider() {
  return useContext(LeaveReportContext);
}

export function LeaveReportProvider({ children }: { children: ReactElement }) {
  const value = {};
  return <LeaveReportContext.Provider value={value}>{children}</LeaveReportContext.Provider>;
}
