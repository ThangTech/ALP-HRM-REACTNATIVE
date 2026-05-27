import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { DisciplineDetailState } from './DisciplineDetailState';
import { useDisciplineDetailApi } from './hooks/useDisciplineDetailApi';
import { Discipline } from 'common/model/discipline';

const DisciplineDetailContext = createContext<DisciplineDetailType>(null!);

interface DisciplineDetailType {
  state: DisciplineDetailState;
  setState: Dispatch<SetStateAction<DisciplineDetailState>>;
  discipline?: Discipline;
}

export function useDisciplineDetailProvider() {
  return useContext(DisciplineDetailContext);
}

export function DisciplineDetailProvider({
  children,
  id,
}: {
  children: ReactElement;
  id?: number;
}) {
  const [state, setState] = useState<DisciplineDetailState>({
    id: id,
  });
  const api = useDisciplineDetailApi(state);
  const value = {
    state,
    setState,
    discipline: api.disciplineDetail,
  };
  return (
    <DisciplineDetailContext.Provider value={value}>{children}</DisciplineDetailContext.Provider>
  );
}
