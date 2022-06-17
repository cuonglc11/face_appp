import AsyncStorage from '@react-native-community/async-storage';

const KEY_LOCAL = 'fcmToken';

export async function getFcmLocalToken() {
  const session = await AsyncStorage.getItem(KEY_LOCAL);
  return session || '';
}

export function setFcmLocalToken(token) {
  return AsyncStorage.setItem(KEY_LOCAL, token);
}

export function clearFcmLocalToken() {
  return AsyncStorage.removeItem(KEY_LOCAL);
}
