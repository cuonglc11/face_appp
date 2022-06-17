import actionTypes from './types';
import CommonRequest from '../repositories/remote/request/CommonRequest';
import {checkingMobile} from '../repositories/service/userService';

export const getUserLogin = payload => ({
  type: actionTypes.GET_USER_LOGIN,
  payload: payload,
});

export const checkingUserMobi = payload => dispatch => {
  const commonRequest = new CommonRequest();
  commonRequest.addParam('code', payload?.code);
  commonRequest.addParam('latitude', payload?.latitude);
  commonRequest.addParam('longitude', payload?.longitude);
  commonRequest.addParam('type', payload?.type);
  commonRequest.addParam('face_img', payload?.face_img);
  checkingMobile(commonRequest, res => {
    console.log(res);
  });
};
