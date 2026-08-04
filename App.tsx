import { TamaguiProvider } from '@tamagui/core';
import React from 'react';
import config from './tamagui.config';
import { AppState, Alert } from 'react-native';
import { SWRConfig } from 'swr';
import AppProvider from './src/navigators/AppProvider';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import { scale } from 'utils';
import { Host } from 'react-native-portalize';
import { PortalProvider } from 'tamagui';
import { AppNavigator } from 'navigators/AppNavigator';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MenuProvider } from 'react-native-popup-menu';
import { useForceUpdate } from 'hooks';
import { ForceUpdateModal } from 'components';
import Geolocation from '@react-native-community/geolocation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';

async function checkForOTAUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert('Có bản vá lỗi mới', 'Ứng dụng sẽ khởi động lại để áp dụng cập nhật.', [
        { text: 'OK', onPress: () => Updates.reloadAsync() },
      ]);
    }
  } catch {
    // expo-updates không hoạt động với Metro dev server - bỏ qua lỗi
  }
}

const AppContent = () => {
  const { isUpdateRequired, isLoading, currentVersion, minVersion, openStore } = useForceUpdate();
  Geolocation.setRNConfiguration({
    skipPermissionRequests: true,
  });

  React.useEffect(() => {
    if (!isLoading && !isUpdateRequired) {
      checkForOTAUpdate();
    }
  }, [isLoading, isUpdateRequired]);

  return (
    <>
      <AppNavigator onReady={() => SplashScreen.hide()} />
      <Toast topOffset={scale(60)} />

      {/* Force Update Modal */}
      <ForceUpdateModal
        visible={isUpdateRequired && !isLoading}
        currentVersion={currentVersion}
        minVersion={minVersion}
        onUpdate={openStore}
      />
    </>
  );
};

const App = (): React.JSX.Element => {
  const swrConfig: React.ComponentProps<typeof SWRConfig>['value'] = {
    provider: () => new Map(),
    isVisible: () => true,
    onErrorRetry: (error, _key, config, revalidate, { retryCount }) => {
      if (error && (error as any).code >= 400 && (error as any).code < 500) {
        return;
      }

      const maxRetry = config.errorRetryCount ?? 3;
      if (retryCount >= maxRetry) {
        return;
      }

      setTimeout(() => revalidate({ retryCount }), config.errorRetryInterval || 5000);
    },
    initFocus(cb) {
      let state = AppState.currentState;
      const sub = AppState.addEventListener('change', (s) => {
        if (state !== 'active' && s === 'active') {
          cb();
        }
        state = s;
      });

      return () => sub.remove();
    },
  };

  return (
    <SWRConfig value={swrConfig}>
      <AppProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          <PortalProvider>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <MenuProvider>
                  <Host>
                    <AppContent />
                  </Host>
                </MenuProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </PortalProvider>
        </TamaguiProvider>
      </AppProvider>
    </SWRConfig>
  );
};

export default App;
