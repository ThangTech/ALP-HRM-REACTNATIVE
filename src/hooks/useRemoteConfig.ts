import { useEffect, useState } from 'react';
import {
  getRemoteConfig,
  setConfigSettings,
  setDefaults,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';

interface RemoteConfigState {
  showHiddenFeatures: boolean;
  isLoading: boolean;
}

export const useRemoteConfig = () => {
  const [state, setState] = useState<RemoteConfigState>({
    showHiddenFeatures: false,
    isLoading: true,
  });

  useEffect(() => {
    fetchRemoteConfig();
  }, []);

  const fetchRemoteConfig = async () => {
    try {
      const remoteConfigInstance = getRemoteConfig();

      // Cấu hình Remote Config
      await setConfigSettings(remoteConfigInstance, {
        minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000, // 0 cho dev, 1 hour cho production
      });

      // Set default values
      await setDefaults(remoteConfigInstance, {
        show_hidden_features: false,
      });

      // Fetch & activate
      await fetchAndActivate(remoteConfigInstance);

      // Đọc giá trị show_hidden_features
      const showHiddenFeaturesValue = getValue(remoteConfigInstance, 'show_hidden_features');
      const showHiddenFeatures = showHiddenFeaturesValue.asBoolean();

      console.log('🔧 Remote Config - show_hidden_features:', showHiddenFeatures);

      setState({
        showHiddenFeatures,
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Remote Config Error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        showHiddenFeatures: false,
      }));
    }
  };

  return {
    ...state,
    refetch: fetchRemoteConfig,
  };
};

export default useRemoteConfig;
