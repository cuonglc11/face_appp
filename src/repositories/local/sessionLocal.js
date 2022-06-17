import AsyncStorage from '@react-native-community/async-storage';

const KEY_SESSION = 'access_token';
const NAME_USER = 'name_user';
const CODE_USER = 'code_user';
const KEY_REFRESH = 'refresh_token';
const KEY_IP_ADDRESS = 'ipAddress';

async function getAccessToken() {
  const session = await AsyncStorage.getItem(KEY_SESSION);
  return session || '';
}

async function getRefreshToken() {
  const session = await AsyncStorage.getItem(KEY_REFRESH);
  return session || '';
}

async function getNameUser() {
  const session = await AsyncStorage.getItem(NAME_USER);
  return session || '';
}

async function getCodeUser() {
  const session = await AsyncStorage.getItem(CODE_USER);
  return session || '';
}

async function getIpAddress() {
  const session = await AsyncStorage.getItem(KEY_IP_ADDRESS);
  return session || '';
}

function save(accessToken) {
  return AsyncStorage.setItem(KEY_SESSION, accessToken);
}

function saveName(nameUser) {
  return AsyncStorage.setItem(NAME_USER, nameUser);
}

function saveCodeUser(codeUser) {
  return AsyncStorage.setItem(CODE_USER, codeUser);
}

function saveIpAddress(ip) {
  return AsyncStorage.setItem(KEY_IP_ADDRESS, ip);
}

function saveIsTermOfUser(isTermOfUser) {
  return AsyncStorage.setItem('isTermOfUser', isTermOfUser);
}

async function getIsTermOfUser() {
  const session = await AsyncStorage.getItem('isTermOfUser');
  return session || '';
}

function saveRefreshToken(refreshToken) {
  return AsyncStorage.setItem(KEY_REFRESH, refreshToken);
}

function clearAccessToken() {
  return AsyncStorage.removeItem(KEY_SESSION);
}

function clearNameUser() {
  return AsyncStorage.removeItem(NAME_USER);
}

module.exports = {
  getAccessToken,
  save,
  clearAccessToken,
  getRefreshToken,
  saveName,
  getNameUser,
  clearNameUser,
  saveRefreshToken,
  saveIsTermOfUser,
  getIsTermOfUser,
  saveCodeUser,
  getCodeUser,
  saveIpAddress,
  getIpAddress,
};
