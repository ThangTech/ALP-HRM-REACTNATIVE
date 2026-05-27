import React from 'react';
import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { DisciplineListState } from './DisciplineListState';
import { DisciplineType } from 'common/enum/discipline-type';
import { useDisciplineDetailApi } from './hooks/useDisciplineDetailApi';
import { BaseResponsePagination } from 'common/model/base-response';
import { Discipline } from 'common/model/discipline';

const DisciplineListContext = createContext<DisciplineListType>(null!);

interface DisciplineListType {
  state: DisciplineListState;
  setState: Dispatch<SetStateAction<DisciplineListState>>;
  disciplines?: BaseResponsePagination<Discipline>;
  refresh: () => void;
}

export function useDisciplineListProvider() {
  return useContext(DisciplineListContext);
}

export function DisciplineListProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<DisciplineListState>({
    disciplineType: { key: DisciplineType.REWARD, value: 'Khen thưởng' },
    disciplineTypes: [
      { key: DisciplineType.REWARD, value: 'Khen thưởng' },
      { key: DisciplineType.DISCIPLINE, value: 'Kỷ luật' },
    ],
    disciplines: [],
  });

  const api = useDisciplineDetailApi(state);
  const value = {
    state,
    setState,
    disciplines: api.disciplineList,
    refresh: api.refresh,
  };
  return <DisciplineListContext.Provider value={value}>{children}</DisciplineListContext.Provider>;
}
