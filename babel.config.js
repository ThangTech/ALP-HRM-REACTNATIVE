const config = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: 'react-native-dotenv',
        allowUndefined: true,
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: './src',
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          home: './src/modules/home',
          setting: './src/modules/setting',
          notification: './src/modules/notification',
          user: './src/modules/user',
          vps: './src/modules/vps',
          news: './src/modules/news',
          timesheet: './src/modules/timesheet',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

module.exports = config;
