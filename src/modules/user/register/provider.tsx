import { ReactElement, createContext, useContext } from 'react';

const RegisterContext = createContext<RegisterType>(null!);

interface RegisterType {}

export function useRegisterProvider() {
  return useContext(RegisterContext);
}

export function RegisterProvider({ children }: { children: ReactElement }) {
  const value = {};
  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}
