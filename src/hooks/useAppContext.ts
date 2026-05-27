import { createContext, useContext } from 'react';

const AppContext = createContext<AppContext>({} as AppContext);

let initCtx: AppContext;

const useAppContext = (_initCtx?: AppContext) => {
  if (initCtx === undefined && _initCtx) {
    initCtx = _initCtx;
  }

  const ctx = useContext(AppContext);

  if (!Object.keys(ctx).length && initCtx) {
    return initCtx;
  }

  return ctx;
};

export const AppProvider = AppContext.Provider;
export default useAppContext;
