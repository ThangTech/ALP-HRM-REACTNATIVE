import {
  ANDROID_VERSION_NAME,
  ANDROID_VERSION_CODE,
  HOST,
  APP_NAME,
  DB_NAME,
} from 'react-native-dotenv';

export const ENV = {
  ANDROID_VERSION_NAME,
  ANDROID_VERSION_CODE,
  HOST,
  APP_NAME,
  DB_NAME,
} as const;

// Type for environment variables
export type EnvType = typeof ENV;

// Helper function to get environment variable
export const getEnv = (key: keyof EnvType): string => {
  return ENV[key] || '';
};
