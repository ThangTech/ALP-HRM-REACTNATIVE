import { useEffect, useState } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import {
  getRemoteConfig,
  setConfigSettings,
  setDefaults,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';

// Định nghĩa types cho config
interface PlatformConfig {
  minimum_version: string;
  store_url: string;
  force_update: boolean;
}

interface AppVersionConfig {
  ios: PlatformConfig;
  android: PlatformConfig;
}

interface ForceUpdateState {
  isUpdateRequired: boolean;
  isLoading: boolean;
  currentVersion: string;
  minVersion: string;
  storeUrl: string;
}

const extractNumericVersion = (version: string): string => {
  return version.split('-')[0] || version;
};

const compareVersions = (current: string, min: string): number => {
  const cleanCurrent = extractNumericVersion(current);
  const cleanMin = extractNumericVersion(min);

  const currentParts = cleanCurrent.split('.').map(Number);
  const minParts = cleanMin.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const minPart = minParts[i] || 0;

    if (currentPart < minPart) {
      return -1;
    }
    if (currentPart > minPart) {
      return 1;
    }
  }

  return 0;
};

// Default config nếu không fetch được từ Remote Config
const DEFAULT_CONFIG: AppVersionConfig = {
  ios: {
    minimum_version: '1.0',
    store_url: 'https://apps.apple.com/us/app/anlocphat-hrm/id6778250271',
    force_update: false,
  },
  android: {
    minimum_version: '0.0.1',
    store_url: 'https://play.google.com/store/apps/details?id=com.vdx.alphrm',
    force_update: false,
  },
};

export const useForceUpdate = () => {
  const [state, setState] = useState<ForceUpdateState>({
    isUpdateRequired: false,
    isLoading: true,
    currentVersion: '',
    minVersion: '',
    storeUrl: '',
  });

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      // Lấy Remote Config instance (modular API)
      const remoteConfigInstance = getRemoteConfig();

      // Cấu hình Remote Config
      await setConfigSettings(remoteConfigInstance, {
        minimumFetchIntervalMillis: 0,
      });

      // Set default values
      await setDefaults(remoteConfigInstance, {
        app_version_config: JSON.stringify(DEFAULT_CONFIG),
      });

      // Fetch & activate
      await fetchAndActivate(remoteConfigInstance);

      // Đọc và parse JSON config
      const configValue = getValue(remoteConfigInstance, 'app_version_config');
      const configString = configValue.asString();
      const config: AppVersionConfig = JSON.parse(configString);

      // Lấy config theo platform
      const platformConfig = Platform.OS === 'ios' ? config.ios : config.android;

      // Lấy version hiện tại của app
      const currentVersion = DeviceInfo.getVersion();

      console.log('🔍 Force Update Check:', {
        platform: Platform.OS,
        currentVersion,
        minVersion: platformConfig.minimum_version,
        forceUpdate: platformConfig.force_update,
        storeUrl: platformConfig.store_url,
      });

      // Check nếu cần update
      const needsUpdate =
        platformConfig.force_update &&
        compareVersions(currentVersion, platformConfig.minimum_version) < 0;

      setState({
        isUpdateRequired: needsUpdate,
        isLoading: false,
        currentVersion,
        minVersion: platformConfig.minimum_version,
        storeUrl: platformConfig.store_url,
      });
    } catch (error) {
      console.error('❌ Force Update Error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isUpdateRequired: false,
      }));
    }
  };

  const openStore = () => {
    const url =
      state.storeUrl ||
      (Platform.OS === 'ios' ? DEFAULT_CONFIG.ios.store_url : DEFAULT_CONFIG.android.store_url);

    Linking.openURL(url).catch((err) => {
      Alert.alert('Lỗi', 'Không thể mở Store. Vui lòng thử lại.');
      console.error('Cannot open store:', err);
    });
  };

  return {
    ...state,
    openStore,
    checkForUpdate,
  };
};

export default useForceUpdate;
