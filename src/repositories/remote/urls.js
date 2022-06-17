import configs from '../../constants/configs';
import store from '../../store';
const {appState} = store.getState();

const prefix = configs.development ? 'dev' : '';

const ACCOUNT = `https://${prefix}account.${configs.HOST}`;
// const BASE_URL = 'http://113.160.218.241:8003/';

const urls = {
  LOGIN: `${appState.ipAddress}check_code/`,
  GET_CHECKIN_CUSTOMER: `${appState.ipAddress}get_data_checking_customer/`,
  SAVE_DEVICE_TOKEN: `${appState.ipAddress}update_fcm_token_by_code/`,
  DELETE_DEVICE_TOKEN: `${appState.ipAddress}remove_fcm_token/`,
  SEARCH_FACE: `${appState.ipAddress}search_face/`,
  CHECKing_MOBILE: `${appState.ipAddress}checking_mobi/`,
};

export default urls;
