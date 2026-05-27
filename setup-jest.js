import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

jest.mock('hooks/useStorage', () => ({
  __esModule: true,
  default: jest.fn(() => [
    { data: null, loading: false, error: null },
    { save: jest.fn(), remove: jest.fn() },
  ]),
}));

jest.mock('react-native-vision-camera', () => {
  return {
    Camera: jest.fn(() => null),
    useCameraDevice: jest.fn(() => ({
      id: 'back',
      position: 'back',
    })),
    useCameraDevices: jest.fn(() => ({
      back: { id: 'back', position: 'back' },
      front: { id: 'front', position: 'front' },
    })),
  };
});

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  exists: jest.fn(),
  unlink: jest.fn(),
  mkdir: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getBuildNumber: () => '100',
}));

jest.mock('@revopush/react-native-code-push', () => {
  const codePush = () => (AppComponent) => AppComponent;

  codePush.CheckFrequency = {
    ON_APP_START: 1,
    ON_APP_RESUME: 2,
    MANUAL: 3,
  };

  return codePush;
});

jest.mock('react-native-view-shot', () => ({
  __esModule: true,
  default: () => null,
  captureRef: jest.fn(),
}));

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  pickSingle: jest.fn(),
  types: {},
}));

jest.mock('react-native-webview', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('react-native-calendars', () => ({
  Calendar: jest.fn(() => null),
  CalendarList: jest.fn(() => null),
  Agenda: jest.fn(() => null),
  LocaleConfig: {
    locales: {},
    defaultLocale: 'en',
  },
}));

jest.mock('@react-native-firebase/remote-config', () => {
  const mockRemoteConfigInstance = {};
  return {
    getRemoteConfig: jest.fn(() => mockRemoteConfigInstance),
    setConfigSettings: jest.fn(() => Promise.resolve()),
    setDefaults: jest.fn(() => Promise.resolve()),
    fetchAndActivate: jest.fn(() => Promise.resolve(true)),
    getValue: jest.fn(() => ({
      asString: () =>
        '{"ios":{"minimum_version":"1.0","store_url":"","force_update":false},"android":{"minimum_version":"0.0.1","store_url":"","force_update":false}}',
      asBoolean: () => false,
    })),
  };
});
