import { ReactElement, createContext, useContext } from 'react';
import { useTaxApi } from './hooks/useTaxApi';
import { Tax } from 'common/model/tax';

const TaxContext = createContext<TaxType>(null!);

interface TaxType {
  tax?: Tax;
}

export function useTaxProvider() {
  return useContext(TaxContext);
}

export function TaxProvider({ children }: { children: ReactElement }) {
  const taxApi = useTaxApi();

  const value = {
    tax: taxApi.tax?.data,
  };
  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
}
