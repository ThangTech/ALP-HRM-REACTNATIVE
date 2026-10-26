import { useEffect } from 'react';
import { navigate, resetRoot } from '../navigators/navigationUtilities';
import { RouteName } from '../configs/navigation';
import useAppContext from './useAppContext';
import { AppStateManager } from './api';

export function useUnauthorized() {
  const { setUser } = useAppContext();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear user context
      setUser({} as User);
      // Navigate to login
      navigate(RouteName.Login);
      // Dùng resetRoot thay vì navigate để UNMOUNT toàn bộ màn hình authenticated
      // navigate() chỉ push Login lên stack, các màn hình cũ vẫn còn SWR hooks đang chạy
      resetRoot({ index: 0, routes: [{ name: RouteName.Login }] });
    };

    // Subscribe to unauthorized events
    const unsubscribe = AppStateManager.getInstance().onUnauthorized(handleUnauthorized);

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [setUser]);
}
