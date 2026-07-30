import Reactotron, { networking } from 'reactotron-react-native';

// Cấu hình Reactotron
Reactotron.configure({
  name: 'ALPHRM',
})
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: false,
  })
  .use(networking())
  .connect();

if (__DEV__) {
  Reactotron.clear();
}

console.tron = Reactotron;
