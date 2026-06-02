import * as Keychain from 'react-native-keychain';

const KEYCHAIN_LOGIN_CREDENTIALS = 'login.credentials';

export async function saveCredentials(username: string, password: string) {
  return Keychain.setGenericPassword(username, password, {
    service: KEYCHAIN_LOGIN_CREDENTIALS,
    storage: Keychain.STORAGE_TYPE.FB,
  }).catch((e) => {
    console.error('KC: save credentials', e);
  });
}

export async function getCredentials() {
  try {
    const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_LOGIN_CREDENTIALS });
    return creds ? { username: creds.username, password: creds.password } : null;
  } catch (e) {
    console.error('KC: read credentials', e);
    return null;
  }
}

export async function clearCredentials() {
  return Keychain.resetGenericPassword({ service: KEYCHAIN_LOGIN_CREDENTIALS }).catch(
    console.error,
  );
}
