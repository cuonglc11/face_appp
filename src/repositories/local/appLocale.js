import AsyncStorage from '@react-native-community/async-storage';

const KEY_LOCALE = 'access_token';
const LOCALE_KEY = {
  access_token: 'access_token',
  phone_number: 'phone_number',
  storage_infor: 'storage_infor',
  fcm_token: 'fcm_token',
  confirm_investment: 'confirm_investment',
  ipAddress: '',
};

export default LOCALE_KEY;
export async function getLocale() {
  const session = await AsyncStorage.getItem(KEY_LOCALE);
  return session || '';
}

export function setLocale(locale) {
  return AsyncStorage.setItem(KEY_LOCALE, locale);
}

export function clearLocaleSetting() {
  return AsyncStorage.removeItem(KEY_LOCALE);
}

export function clearLocale(key) {
  return AsyncStorage.removeItem(key);
}
