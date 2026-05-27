import {
  ANDROID_VERSION_CODE,
  ANDROID_VERSION_NAME,
  HOST,
  APP_NAME,
  CODE_PUSH_IOS_DEPLOYMENT_KEY,
  CODE_PUSH_ANDROID_DEPLOYMENT_KEY,
  WS_URL,
  API_URL,
} from 'react-native-dotenv';

export default {
  androidVersionCode: ANDROID_VERSION_CODE,
  androidVersionName: ANDROID_VERSION_NAME,
  host: HOST,
  appName: APP_NAME,
  codePushIosDeploymentKey: CODE_PUSH_IOS_DEPLOYMENT_KEY,
  codePushAndroidDeploymentKey: CODE_PUSH_ANDROID_DEPLOYMENT_KEY,
  wsUrl: WS_URL,
  apiUrl: API_URL,
} as const;
