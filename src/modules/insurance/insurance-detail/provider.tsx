import React, { createContext, ReactElement, useContext } from 'react';
import { InsuranceType } from 'common/enum/insurance-type';
import { useInsuranceDetailApi } from './hooks/useInsuranceDetailApi';
import { Insurance, InsuranceOther } from 'common/model/insurance';

const InsuranceDetailContext = createContext<InsuranceDetailType>(null!);

interface InsuranceDetailType {
  insurance?: Insurance;
  insuranceHealthDetail?: InsuranceOther;
}

export function useInsuranceDetailProvider() {
  return useContext(InsuranceDetailContext);
}

export function InsuranceDetailProvider({
  children,
  type,
}: {
  children: ReactElement;
  type?: InsuranceType;
}) {
  const api = useInsuranceDetailApi(type);
  const value = {
    insurance: api.insuranceDetail,
    insuranceHealthDetail: api.insuranceHealthDetail,
  };
  return (
    <InsuranceDetailContext.Provider value={value}>{children}</InsuranceDetailContext.Provider>
  );
}
