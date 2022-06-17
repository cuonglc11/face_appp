import urls from '../remote/urls';
import {networkRef} from '../remote/network';
import headersConst from '../remote/network/headers';
import LoginRequest from '../remote/request/auth/LoginRequest';

function login(loginRequest: LoginRequest, onSuccess) {
  const params = loginRequest.getParams();
  const headers = {};
  headers[headersConst.CONTENT_TYPE] = headersConst.APPLICATION_JSON;
  networkRef.current.post(urls.LOGIN, params, onSuccess);
}

module.exports = {
  login,
};
