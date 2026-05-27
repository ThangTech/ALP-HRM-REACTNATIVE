import { useEffect } from 'react';
import { navigate } from '../navigators/navigationUtilities';
import { RouteName } from '../configs/navigation';
import useAppContext from './useAppContext';
import { AppStateManager } from './api';

export function useUnauthorized() {
  const { setUser } = useAppContext();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear user context
      setUser({ id: 0, name: '', photo: '' });
      // Navigate to login
      navigate(RouteName.Login);
    };

    // Subscribe to unauthorized events
    const unsubscribe = AppStateManager.getInstance().onUnauthorized(handleUnauthorized);

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [setUser]);
}
