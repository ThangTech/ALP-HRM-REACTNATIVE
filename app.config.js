const path = require('path');
if (process.env.APP_ENV === 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '.env.production') });
}
require('dotenv').config();

module.exports = {
  name: 'alphrm',
  slug: 'anlocphat-hrm',
  displayName: 'ALP HRM',
  extra: {
    eas: {
      projectId: 'd26e434c-0b78-4d72-ba7f-ec034c09aa72',
    },
  },
  owner: 'vdx-digital-transformation-solutions-company-limited',
  updates: {
    url: 'https://u.expo.dev/d26e434c-0b78-4d72-ba7f-ec034c09aa72',
  },
  android: {
    runtimeVersion: process.env.ANDROID_VERSION_NAME,
    versionCode: Number(process.env.ANDROID_VERSION_CODE),
  },
  ios: {
    runtimeVersion: process.env.IOS_VERSION_NAME,
    buildNumber: process.env.IOS_VERSION_CODE,
  },
  plugins: ['expo-asset'],
};
