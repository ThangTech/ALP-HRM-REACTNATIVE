import React, { ReactNode, useEffect, useState } from 'react';
import { I18nManager, NativeModules, Platform, ViewStyle, Text, LogBox } from 'react-native';
import useStorage from '../hooks/useStorage';
import i18next, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../i18n';
import useAppContext, { AppProvider as ContextProvider } from '../hooks/useAppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DEFAULT_LANGUAGE } from 'configs/contansts';
import { ToastContainer } from 'components';
import { useUnauthorized } from 'hooks/useUnauthorized';

interface AppProviderProps {
  children: ReactNode;
}

const getDeviceLang = () => {
  if (Platform.OS === 'ios') {
    const locale =
      NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
    return locale ? locale.split('_')[0] : 'en';
  } else {
    return I18nManager.getConstants().localeIdentifier?.split('_')[0] ?? 'en';
  }
};

const deviceLang = getDeviceLang();

const AppProvider = ({ children }: AppProviderProps) => {
  const [{ data: state }, { save: saveAppContext }] = useStorage('global', 'appContext', {
    initValue: {
      theme: 'default',
      lang: 'default',
      factory: 'veston',
      fcmToken: '',
      user: {
        name: '',
        employee_id: 0,
        employee_code: '',
        old_employee_code: '',
        job_id: 0,
        job_name: '',
        group_id: 0,
        group_name: '',
        department_id: 0,
        department_name: '',
        area_category_id: 0,
        area_category_name: '',
        work_location_text: '',
        mobile_phone: '',
        work_email: '',
        onboard_time: '',
        offical_contract_date: '',
        parent: [],
        child: [],
        birthday: '',
        identification_id: '',
        area_provide: '',
        date_provide: '',
        private_email: '',
        place_of_birth: '',
        address_now: '',
        bank_account_name: '',
        account_holder: '',
        bank_id: 0,
        bank_name: '',
        emergency_contact: '',
        emergency_relation: '',
        marital: '',
        marital_label: '',
        count_children: 0,
        children_ids: [],
        certificate_employee: '',
        study_school: '',
        study_field: '',
        image_url: '',
        emergency_phone: '',
        access_staff_transfer: false,
      },
      bluetooth: {
        isConnected: false,
        device: {
          name: '',
          address: '',
        },
      },
      permission: [],
    },
  });

  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useUnauthorized();

  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next
        .use(initReactI18next)
        .init({
          lng: DEFAULT_LANGUAGE,
          fallbackLng: DEFAULT_LANGUAGE,
          resources,
          interpolation: {
            escapeValue: false,
          },
        })
        .then(() => {
          setIsI18nInitialized(true);
        })
        .catch((e) => console.warn('i18n initialization failed:', e));
    } else {
      setIsI18nInitialized(true);
    }
  }, [state?.lang]);

  const setTheme = async (v: AppContext['theme']) => {
    await saveAppContext({
      ...state,
      theme: v,
    });
  };

  const setLang = async (lang: string) => {
    if (!state) {
      return;
    }
    await saveAppContext({ ...state, lang });
    await changeLanguage(lang === 'default' ? deviceLang : lang);
    // if (restart) {
    //   CodePush.restartApp();
    // }
  };

  const setFactory = async (factory: AppContext['factory']) => {
    if (!state) {
      return;
    }
    await saveAppContext((prev) => ({ ...prev!, factory }));
  };

  const setBluetooth = async (bluetooth: AppContext['bluetooth']) => {
    if (!state) {
      return;
    }
    await saveAppContext({ ...state, bluetooth });
  };

  const setUser = async (user: AppContext['user']) => {
    if (!state) {
      return;
    }
    await saveAppContext({ ...state, user });
  };

  const setPermission = async (permission: AppContext['permission']) => {
    if (!state) {
      return;
    }
    await saveAppContext({ ...state, permission });
  };

  const setFcmToken = async (token: AppContext['fcmToken']) => {
    if (!state) {
      return;
    }
    await saveAppContext({ ...state, fcmToken: token });
  };

  const ctx: AppContext | undefined = {
    theme: state?.theme || 'default',
    fcmToken: state?.fcmToken,
    user: state?.user as User,
    setTheme,
    lang: state?.lang || 'vi',
    setLang,
    factory: state?.factory || 'somi',
    setFactory,
    setUser,
    bluetooth: state?.bluetooth,
    setBluetooth,
    permission: state?.permission,
    setPermission,
    setFcmToken,
  };

  useAppContext(ctx);

  // Render only after i18next is initialized
  if (!isI18nInitialized || !ctx) {
    return <Text />;
  }

  return (
    <ContextProvider value={ctx}>
      <GestureHandlerRootView style={$container}>{children}</GestureHandlerRootView>
      <ToastContainer />
    </ContextProvider>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default AppProvider;
