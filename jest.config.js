/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@revopush/react-native-code-push|@native-html/render|@react-native(-community)?|@react-navigation|react-native-fs|react-native-file-viewer|react-native-splash-screen|tamagui|tp-react-native-bluetooth-printer|react-native-device-info|react-native-qrcode-svg|react-native-view-shot|react-native-date-picker|victory-native|react-native-(static-safe-area-insets|ui-lib|animatable|vision-camera|modal|safe-area-context|key-chain|toast-message|linear-gradient|url-polyfill|reanimated|orientation-locker|picker/picker|snap-carousel|image-picker|))/)',
  ],
  moduleNameMapper: {
    '^@react-native-community/geolocation$': '<rootDir>/__mocks__/@react-native-community/geolocation.js',
    '^react-native-keychain$': '<rootDir>/__mocks__/react-native-keychain.js',
  },
  setupFiles: ['<rootDir>/setup-jest.js'],
  testTimeout: 60000,
};

module.exports = config;
