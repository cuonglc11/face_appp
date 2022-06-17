import urls from '../remote/urls';
import {networkRef} from '../remote/network';
import headersConst from '../remote/network/headers';
import CommonRequest from '../remote/request/CommonRequest';

function getChecking(request: CommonRequest, onSuccess, isLoading = true) {
  const params = request.getParams();
  const headers = {};
  headers[headersConst.CONTENT_TYPE] = headersConst.APPLICATION_JSON;
  networkRef.current.post(urls.GET_CHECKIN_CUSTOMER, params, onSuccess, {});
}

export function saveFcmToken(request: CommonRequest, onSuccess) {
  const params = request.getParams();
  const headers = {};
  headers[headersConst.CONTENT_TYPE] = headersConst.APPLICATION_JSON;
  networkRef.current.post(urls.SAVE_DEVICE_TOKEN, params, onSuccess, {}, false);
}

export function removeFcmToken(request: CommonRequest, onSuccess) {
  const params = request.getParams();
  networkRef.current.post(urls.DELETE_DEVICE_TOKEN, params, onSuccess);
}

export function upLoadAvatar(
  thumbnailRequest: CommonRequest,
  onSuccess,
  loading = true,
) {
  const params = thumbnailRequest.getParams();
  const headers = {};
  headers[headersConst.CONTENT_TYPE] = headersConst.APPLICATION_FORM;
  networkRef?.current
    ?.updateAvatarFile(urls.SEARCH_FACE, params, headers, loading)
    .then(result => onSuccess(result));
}

export function checkingMobile(
  commonRequest: CommonRequest,
  onSuccess,
  loading = false,
) {
  const params = commonRequest.getParams();
  const headers = {};
  headers[headersConst.CONTENT_TYPE] = headersConst.APPLICATION_FORM;
  networkRef?.current
    ?.updateAvatarFile(urls.CHECKing_MOBILE, params, headers, loading)
    .then(result => onSuccess(result));
}

module.exports = {
  getChecking,
  saveFcmToken,
  removeFcmToken,
  upLoadAvatar,
  checkingMobile,
};
