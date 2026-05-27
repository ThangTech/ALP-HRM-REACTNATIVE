import { TamaguiProvider } from '@tamagui/core';
import React from 'react';
import config from './tamagui.config';
import { AppState } from 'react-native';
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

const AppContent = () => {
  const { isUpdateRequired, isLoading, currentVersion, minVersion, openStore } = useForceUpdate();
  Geolocation.setRNConfiguration({
    skipPermissionRequests: true,
  });
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
