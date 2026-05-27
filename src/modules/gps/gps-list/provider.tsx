import React from 'react';
import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { useGpsListApi } from './hooks/useGpsListApi';
import { GpsListState } from './GpsListState';
import dayjs from 'dayjs';
import { uniqueId } from 'lodash';

const GpsListContext = createContext<GpsListType>(null!);

interface GpsListType {
  state: GpsListState;
  setState: React.Dispatch<React.SetStateAction<GpsListState>>;
  isLoadingGpsList: boolean;
}

export function useGpsListProvider() {
  return useContext(GpsListContext);
}

export function GpsListProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<GpsListState>({
    limit: 20,
    offset: 0,
    from: dayjs().toDate(),
    to: dayjs().toDate(),
    items: [],
  });
  const gpsListApi = useGpsListApi(state);
  useEffect(() => {
    const records = (gpsListApi.gpsList?.data?.records || []).map((item) => ({
      id: uniqueId(),
      ...item,
    }));
    setState((prev) => ({
      ...prev,
      items: state.offset === 0 ? records : [...prev.items, ...records],
    }));
  }, [gpsListApi.gpsList, state.offset]);
  const value = {
    state,
    setState,
    isLoadingGpsList: gpsListApi.isLoadingGpsList,
  };
  return <GpsListContext.Provider value={value}>{children}</GpsListContext.Provider>;
}
