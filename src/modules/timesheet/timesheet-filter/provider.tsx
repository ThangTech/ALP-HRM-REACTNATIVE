import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { TimeSheetFilterState } from './TimeSheetFilterState';

const TimesheetFilterContext = createContext<TimesheetFilterType>(null!);

interface TimesheetFilterType {
  state: TimeSheetFilterState;
  setState: Dispatch<SetStateAction<TimeSheetFilterState>>;
}

export function useTimesheetFilterProvider() {
  return useContext(TimesheetFilterContext);
}

export function TimesheetFilterProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<TimeSheetFilterState>({});

  const value = {
    state,
    setState,
  };
  return (
    <TimesheetFilterContext.Provider value={value}>{children}</TimesheetFilterContext.Provider>
  );
}
