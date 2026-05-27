const messaging = () => ({
  getToken: jest.fn().mockResolvedValue('fake-fcm-token'),
  deleteToken: jest.fn(),
  requestPermission: jest.fn().mockResolvedValue(1),
  hasPermission: jest.fn().mockResolvedValue(1),

  onMessage: jest.fn(() => jest.fn()),

  setBackgroundMessageHandler: jest.fn(),

  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),

  isDeviceRegisteredForRemoteMessages: jest.fn().mockResolvedValue(true),
  registerDeviceForRemoteMessages: jest.fn(),

  getInitialNotification: jest.fn().mockResolvedValue(null),
});

export default messaging;
