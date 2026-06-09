import React from 'react';
import { SalaryPayslipDetail } from 'common/model/salary-ticket';
import { ReactElement, createContext, useContext } from 'react';
import { useSalaryTicketDetailApi } from './hooks/useSalaryTicketDetailApi';

const SalaryTicketDetailContext = createContext<SalaryTicketDetailType>(null!);

interface SalaryTicketDetailType {
  salaryTicket?: SalaryPayslipDetail;
  isLoading: boolean;
}

export function useSalaryTicketDetailProvider() {
  return useContext(SalaryTicketDetailContext);
}

export function SalaryTicketDetailProvider({
  children,
  id,
}: {
  children: ReactElement;
  id: number;
}) {
  const salaryTicketApi = useSalaryTicketDetailApi(id);
  const value = {
    salaryTicket: salaryTicketApi.salaryTicketDetail,
    isLoading: salaryTicketApi.salaryTicketDetailLoading,
  };
  return (
    <SalaryTicketDetailContext.Provider value={value}>
      {children}
    </SalaryTicketDetailContext.Provider>
  );
}
