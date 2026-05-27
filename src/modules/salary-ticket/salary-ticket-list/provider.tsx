import React, { useEffect } from 'react';
import { ReactElement, createContext, useContext, useState } from 'react';
import { SalaryTicketListState } from './SalaryTicketListState';
import { useSalaryTicketsApi } from './hooks/useSalaryTicketsApi';
import dayjs from 'dayjs';

const SalaryTicketListContext = createContext<SalaryTicketListType>(null!);

interface SalaryTicketListType {
  state: SalaryTicketListState;
  setState: React.Dispatch<React.SetStateAction<SalaryTicketListState>>;
  salaryTicketsLoading: boolean;
}

export function useSalaryTicketListProvider() {
  return useContext(SalaryTicketListContext);
}

export function SalaryTicketListProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<SalaryTicketListState>({
    limit: 20,
    offset: 0,
    dateFrom: dayjs().subtract(1, 'month').startOf('month').toDate(),
    dateTo: dayjs().subtract(1, 'month').endOf('month').toDate(),
    items: [],
  });
  const salaryTicketApi = useSalaryTicketsApi(state);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      items: !state.offset
        ? (salaryTicketApi.salaryTicketData?.data?.records ?? [])
        : [...(prev.items ?? []), ...(salaryTicketApi.salaryTicketData?.data?.records ?? [])],
    }));
  }, [salaryTicketApi.salaryTicketData?.data?.records, state.offset]);

  const value = {
    state,
    setState,
    salaryTicketsLoading: salaryTicketApi.salaryTicketsLoading,
  };
  return (
    <SalaryTicketListContext.Provider value={value}>{children}</SalaryTicketListContext.Provider>
  );
}
