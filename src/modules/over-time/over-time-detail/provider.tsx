import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { OverTimeDetailState } from './OverTimeDetailState';

const OverTimeDetailContext = createContext<OverTimeDetailType>(null!);

interface OverTimeDetailType {
  state: OverTimeDetailState;
  setState: Dispatch<SetStateAction<OverTimeDetailState>>;
}

export function useOverTimeDetailProvider() {
  return useContext(OverTimeDetailContext);
}

export function OverTimeDetailProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<OverTimeDetailState>({});
  const value = {
    state,
    setState,
  };
  return <OverTimeDetailContext.Provider value={value}>{children}</OverTimeDetailContext.Provider>;
}
