import axios from 'axios';
import React, {Component, createRef} from 'react';
import {Alert, Keyboard} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import headerConst from './headers';
import LoadingComponent from '../../../components/LoadingComponent';
import alerts from '../../../constants/alerts';
import LOCALE_KEY, {clearLocale, getLocale} from '../../local/appLocale';
import {navigationRef} from '../../../actions/navigationActions';
import routeNames from '../../../navigators/routeNames';
import common from '../../../utils/common';
import {getAccessToken} from '../../local/sessionLocal';

export let networkRef = createRef();

const TIMEOUT = 60000;
export const networkState = {
  authorized: true,
  isConnected: true,
  queue: [],
  unAuthorize: () => {
    networkState.authorized = false;
  },
  authorize: () => {
    networkState.authorized = true;
    networkState.isConnected = true;
    networkState.queuePop();
  },
  unConnected: () => {
    networkState.isConnected = false;
  },
  connected: () => {
    networkState.isConnected = true;
    networkState.queuePop();
  },
  queuePush: callback => networkState.queue.push(callback),
  queuePop: () => {
    while (networkState.queue.length) {
      const callback = networkState.queue.pop();
      callback();
    }
  },
};

class NetworkService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isConnected: true,
    };
  }

  componentDidMount() {
    NetInfo.addEventListener(state => {
      this.setState({isConnected: state?.isConnected});
    });
    NetInfo.fetch().then(state => {
      this.setState({isConnected: state?.isConnected});
    });
  }

  render() {
    return <LoadingComponent modalVisible={this.state.isLoading} />;
  }

  handleNoNetwork = callback => {
    if (!networkState.isConnected) {
      return;
    }
    networkState.queuePush(callback);
    networkState.unConnected();
    Keyboard.dismiss();
    Alert.alert(
      alerts.title,
      alerts.noNetwork,
      [
        {
          text: 'OK',
          onPress: async () => {
            networkState.connected();
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  handleUnAuthorize = async (callback, message = '') => {
    await clearLocale(LOCALE_KEY.access_token);
    networkState.queuePush(callback);
    if (!networkState.authorized) {
      return;
    }
    networkState.unAuthorize();
    Keyboard.dismiss();
    Alert.alert(
      alerts.title,
      alerts.apiExpiredToken,
      [
        {
          text: 'OK',
          onPress: async () => {
            this.navigateToLogin();
            networkState.authorize();
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  navigateToLogin() {
    this.props.loadAppState({isLoggedIn: false});
  }

  getDefaultHeader = async () => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      return {
        Accept: headerConst.APPLICATION_JSON,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': headerConst.APPLICATION_JSON,
      };
    } else {
      return {
        Accept: headerConst.APPLICATION_JSON,
        'Content-Type': headerConst.APPLICATION_JSON,
      };
    }
  };

  handleResponse = async response => {
    console.log(response, 'response');
    if (!response) {
      Alert.alert(alerts.title, alerts.apiTimeout);
      return;
    }
    const result = await response?.data;
    const status = result?.status;
    if (result?.success === 1) {
      return result;
    }
    if (result?.message === 'unknown') {
      return result;
    }
    if (result?.success === 0 && result?.data?.length === 0) {
      return result;
    }
    if (!status) {
      Alert.alert(alerts.title, alerts.apiError);
    } else if ((status >= 200 && status < 300) || status === true) {
      // return when call api success
      console.log(result, 'RESULT...');
      return result;
    } else if (status === 401) {
      await clearLocale(LOCALE_KEY.access_token);
      Keyboard.dismiss();
      Alert.alert(
        alerts.title,
        result.message ?? alerts.apiExpiredToken,
        [
          {
            text: 'OK',
            onPress: async () => {
              // if (this?.props?.toggleLoggedIn) {
              //   await this?.props?.toggleLoggedIn();
              // }
              await navigationRef?.current?.navigate(routeNames.LOG_IN);
            },
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(alerts.title, result.error_messages ?? alerts.apiError);
    }
  };

  promisePostNormal = (url, params, headers) => async (resolve, reject) => {
    const defaultHeader = await this.getDefaultHeader();

    const requestHeaders = {...defaultHeader, ...headers};
    const formData = new FormData();
    if (params) {
      const keys = Object.keys(params);
      keys.forEach(key => {
        formData.append(key, params[key]);
      });
    }
    const isJson =
      requestHeaders[headerConst.CONTENT_TYPE] &&
      requestHeaders[headerConst.CONTENT_TYPE] === headerConst.APPLICATION_JSON;
    try {
      axios
        .post(url, isJson ? JSON.stringify(params) : formData, {
          headers: requestHeaders,
          timeout: TIMEOUT,
          responseType: 'json',
        })
        .then(response => {
          if ([401].includes(response?.data?.status)) {
            this.handleUnAuthorize(() => {
              this.promisePost(url, params, headers)(resolve, reject);
            }, response?.data?.message ?? '');
          }
          resolve(response);
        })
        .catch(error => {
          if (
            !error?.response &&
            error?.message === alerts.networkError &&
            !this?.state?.isConnected
          ) {
            this.handleNoNetwork(() => {
              this.promisePostNormal(url, params, headers)(resolve, reject);
            });
            return;
          }
          if ([401].includes(error?.response?.data?.status)) {
            this.handleUnAuthorize(() => {
              // this.promisePost(url, params, headers)(resolve, reject);
            }, error?.response?.data?.message ?? '');
          }
          reject(error?.response);
        });
    } catch (error) {
      reject(error?.response);
    }
  };

  postNormal = async (url, params, headers, showLoading = true) => {
    // if (this.state.isConnected) {
    if (showLoading) {
      this.setState({
        isLoading: true,
      });
    }
    const promise = new Promise(this.promisePostNormal(url, params, headers));
    return promise
      .then(async response => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(response);
      })
      .catch(async error => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(error);
      });
    // } else {
    //   Alert.alert(alerts.title, alerts.noNetwork);
    // }
  };

  promisePost =
    (url, params, headers = {}) =>
    async (resolve, reject) => {
      const defaultHeader = await this.getDefaultHeader();
      const requestHeaders = {...defaultHeader, ...headers};
      const formData = new FormData();
      if (params) {
        const keys = Object.keys(params);
        keys.forEach(key => {
          formData.append(key, params[key]);
        });
      }
      const isJson =
        requestHeaders[headerConst.CONTENT_TYPE] &&
        requestHeaders[headerConst.CONTENT_TYPE] ===
          headerConst.APPLICATION_JSON;
      try {
        axios
          .post(url, isJson ? JSON.stringify(params) : formData, {
            headers: requestHeaders,
            timeout: TIMEOUT,
            responseType: 'json',
          })
          .then(response => {
            if ([401].includes(response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, response?.data?.message ?? '');
            }
            resolve(response);
          })
          .catch(error => {
            if (
              !error?.response &&
              error?.message === alerts.networkError &&
              !this?.state?.isConnected
            ) {
              this.handleNoNetwork(() => {
                this.promisePost(url, params, headers)(resolve, reject);
              });
              return;
            }
            if ([401].includes(error?.response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, error?.response?.data?.message ?? '');
            }
            reject(error?.response);
          });
      } catch (error) {
        reject(error?.response);
      }
    };

  post = (url, params, onSuccess, headers = {}, isLoading = true) => {
    if (this.state.isConnected) {
      if (isLoading) {
        this.setState({
          isLoading: true,
        });
      }
      const promise = new Promise(this.promisePost(url, params, headers));
      return promise
        .then(async response => {
          if (isLoading) {
            this.setState({
              isLoading: false,
            });
          }
          const res = await this.handleResponse(response);
          if (res && onSuccess) {
            onSuccess(res);
          }
        })
        .catch(async error => {
          console.log(error, 'error');
          if (isLoading) {
            this.setState({
              isLoading: false,
            });
          }
          if (error?.status === 401) return;
          const res = await this.handleResponse(error);
          if (res && onSuccess) {
            onSuccess(res);
          }
        });
    } else {
      Alert.alert(alerts.title, alerts.noNetwork);
    }
  };

  promisePostFieldMulti =
    (url, params, headers, listFields) => async (resolve, reject) => {
      const defaultHeader = await this.getDefaultHeader();
      const requestHeaders = {...defaultHeader, ...headers};
      const formData = new FormData();
      if (params) {
        const keys = Object.keys(params);
        keys.forEach(key => {
          formData.append(key, params[key]);
        });
      }
      if (listFields) {
        listFields.forEach(item => {
          // formData.append(paramKeys.DEPRECIATION_PRICE, item.price);
        });
      }
      const isJson =
        requestHeaders[headerConst.CONTENT_TYPE] &&
        requestHeaders[headerConst.CONTENT_TYPE] ===
          headerConst.APPLICATION_JSON;
      try {
        axios
          .post(url, isJson ? JSON.stringify(params) : formData, {
            headers: requestHeaders,
            timeout: TIMEOUT,
            responseType: 'json',
          })
          .then(response => {
            if ([401].includes(response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, response?.data?.message ?? '');
            }
            resolve(response);
          })
          .catch(error => {
            if (
              !error?.response &&
              error?.message === alerts.networkError &&
              !this?.state?.isConnected
            ) {
              this.handleNoNetwork(() => {
                this.promisePostFieldMulti(
                  url,
                  params,
                  headers,
                  listFields,
                )(resolve, reject);
              });
              return;
            }
            if ([401].includes(error?.response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, error?.response?.data?.message ?? '');
            }
            reject(error?.response);
          });
      } catch (error) {
        reject(error?.response);
      }
    };

  postFieldMulti = (url, params, headers, showLoading = true, listFields) => {
    // if (this.state.isConnected) {
    if (showLoading) {
      this.setState({
        isLoading: true,
      });
    }
    const promise = new Promise(
      this.promisePostFieldMulti(url, params, headers, listFields),
    );
    return promise
      .then(async response => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(response);
      })
      .catch(async error => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(error);
      });
    // } else {
    //   Alert.alert(alerts.title, alerts.noNetwork);
    // }
  };

  promisePostSimply = (url, params, headers) => async (resolve, reject) => {
    const formData = new FormData();
    if (params) {
      const keys = Object.keys(params);
      keys.forEach(key => {
        formData.append(key, params[key]);
      });
    }
    const isJson =
      headers[headerConst.CONTENT_TYPE] &&
      headers[headerConst.CONTENT_TYPE] === headerConst.APPLICATION_JSON;
    try {
      axios
        .post(url, isJson ? JSON.stringify(params) : formData, {
          headers: headers,
          timeout: TIMEOUT,
          responseType: 'json',
        })
        .then(response => {
          if ([401].includes(response?.data?.status)) {
            this.handleUnAuthorize(() => {
              // this.promisePost(url, params, headers)(resolve, reject);
            }, response?.data?.message ?? '');
          }
          resolve(response);
        })
        .catch(error => {
          if (
            !error?.response &&
            error?.message === alerts.networkError &&
            !this?.state?.isConnected
          ) {
            this.handleNoNetwork(() => {
              this.promisePostSimply(url, params, headers)(resolve, reject);
            });
            return;
          }
          if ([401].includes(error?.response?.data?.status)) {
            this.handleUnAuthorize(() => {
              // this.promisePost(url, params, headers)(resolve, reject);
            }, error?.response?.data?.message ?? '');
          }
          reject(error?.response);
        });
    } catch (error) {
      reject(error?.response);
    }
  };

  postSimply = (url, params, headers) => {
    // if (this.state.isConnected) {
    const promise = new Promise(this.promisePostSimply(url, params, headers));
    return promise
      .then(async response => {
        return await this.handleResponse(response);
      })
      .catch(async error => {
        return await this.handleResponse(error);
      });
    // } else {
    //   Alert.alert(alerts.title, alerts.noNetwork);
    // }
  };

  promisePostFile =
    (url, params, headers, type, uri, name, typeImage, files, idContract) =>
    async (resolve, reject) => {
      const defaultHeader = await this.getDefaultHeader();
      const requestHeaders = {...defaultHeader, ...headers};

      const formData = new FormData();
      formData.append('type', 2);
      formData.append('type_img', typeImage);
      formData.append('id', idContract);
      files.pop();
      files.forEach(file => {
        const fileObject = {
          uri: file.path,
          name: common.getFileName(file),
          type: file.mime,
        };
        formData.append('file[]', fileObject);
      });

      try {
        axios
          .post(url, formData, {
            headers: requestHeaders,
            timeout: TIMEOUT,
            responseType: 'json',
          })
          .then(response => {
            if ([401].includes(response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, response?.data?.message ?? '');
            }
            resolve(response);
          })
          .catch(error => {
            if (
              !error?.response &&
              error?.message === alerts.networkError &&
              !this?.state?.isConnected
            ) {
              this.handleNoNetwork(() => {
                this.promisePostFile(
                  url,
                  params,
                  headers,
                  type,
                  uri,
                  name,
                  typeImage,
                  files,
                  idContract,
                )(resolve, reject);
              });
              return;
            }
            if ([401].includes(error?.response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, error?.response?.data?.message ?? '');
            }
            reject(error?.response);
          });
      } catch (error) {
        reject(error?.response);
      }
    };

  postFile = (
    url,
    params,
    headers,
    type,
    uri,
    name,
    typeImage,
    files,
    idContract,
  ) => {
    // if (this.state.isConnected) {
    this.setState({
      isLoading: true,
    });
    const promise = new Promise(
      this.promisePostFile(
        url,
        params,
        headers,
        type,
        uri,
        name,
        typeImage,
        files,
        idContract,
      ),
    );
    return promise
      .then(async response => {
        this.setState({
          isLoading: false,
        });
        return await this.handleResponse(response);
      })
      .catch(async error => {
        this.setState({
          isLoading: false,
        });
        return await this.handleResponse(error);
      });
    // } else {
    //   Alert.alert(alerts.title, alerts.noNetwork);
    // }
  };

  promiseGetSimply = url => async (resolve, reject) => {
    try {
      axios
        .post(url, {
          timeout: TIMEOUT,
          responseType: 'json',
        })
        .then(response => {
          const result = !response ? TIMEOUT : response?.data;
          if (result && typeof result === 'object') {
            result.headers = response?.headers;
          }
          if ([401].includes(response?.data?.status)) {
            this.handleUnAuthorize(() => {
              // this.promisePost(url, params, headers)(resolve, reject);
            }, response?.data?.message ?? '');
          }
          resolve(result);
        })
        .catch(error => {
          if (
            !error?.response &&
            error?.message === alerts.networkError &&
            !this?.state?.isConnected
          ) {
            this.handleNoNetwork(() => {
              this.promiseGetSimply(url)(resolve, reject);
            });
            return;
          }
          const result = !error?.response ? TIMEOUT : error?.response?.data;
          if (result && typeof result === 'object') {
            result.headers = error?.response?.headers;
          }
          if ([401].includes(error?.response?.data?.status)) {
            this.handleUnAuthorize(() => {
              // this.promisePost(url, params, headers)(resolve, reject);
            }, error?.response?.data?.message ?? '');
          }
          reject(result);
        });
    } catch (error) {
      const result = !error?.response ? TIMEOUT : error?.response?.data;
      if (result && typeof result === 'object') {
        result.headers = error?.response?.headers;
      }
      resolve(result);
    }
  };

  getSimply = url => new Promise(this.promiseGetSimply(url));

  get = (url, params, onSuccess, headers = {}, isLoading = true) => {
    if (this.state.isConnected) {
      if (isLoading) {
        this.setState({
          isLoading: true,
        });
      }
      const promise = new Promise(this.promiseGet(url, params, headers));
      return promise
        .then(async response => {
          if (isLoading) {
            this.setState({
              isLoading: false,
            });
          }
          const res = await this.handleResponse(response);
          if (res && onSuccess) {
            onSuccess(res);
          }
        })
        .catch(async error => {
          console.log(error);
          if (isLoading) {
            this.setState({
              isLoading: false,
            });
          }
          if (error.status === 401) {
            return;
          }
          const res = await this.handleResponse(error);
          if (res && onSuccess) {
            onSuccess(res);
          }
        });
    } else {
      Alert.alert(alerts.title, alerts.noNetwork);
    }
  };

  promiseGet =
    (url, params, headers = {}) =>
    async (resolve, reject) => {
      const body = [];
      const defaultHeader = await this.getDefaultHeader();
      const requestHeaders = {...defaultHeader, ...headers};
      if (params) {
        const keys = Object.keys(params);
        keys.forEach(key => {
          body.push(`${key}=${params[key]}`);
        });
      }
      const strQuery = body.join('&');
      const finalUrl = params ? `${url}?${strQuery}` : `${url}`;
      try {
        axios
          .get(finalUrl, {
            headers: requestHeaders,
            timeout: TIMEOUT,
            responseType: 'json',
          })
          .then(response => {
            if ([401].includes(response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, alerts.apiExpiredToken);
            }
            resolve(response);
          })
          .catch(error => {
            if (
              !error?.response &&
              error?.message === alerts.networkError &&
              !this?.state?.isConnected
            ) {
              this.handleNoNetwork(() => {
                this.promisePost(url, params, headers)(resolve, reject);
              });
              return;
            }
            if ([401].includes(error?.response?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, error?.response?.data?.message ?? '');
            }
            reject(error?.response);
          });
      } catch (error) {
        console.log(error);
        reject(error?.response);
      }
    };

  updateAvatarFile = (url, params, headers, showLoading = true) => {
    // if (this.state.isConnected) {
    if (showLoading) {
      this.setState({
        isLoading: true,
      });
    }
    const promise = new Promise(
      this.promiseUpdateProfileContainFile(url, params, headers),
    );
    return promise
      .then(async response => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(response);
      })
      .catch(async error => {
        if (showLoading) {
          this.setState({
            isLoading: false,
          });
        }
        return await this.handleResponse(error);
      });
    // } else {
    //   Alert.alert(alerts.title, alerts.noNetwork);
    // }
  };

  promiseUpdateProfileContainFile =
    (url, params, headers) => async (resolve, reject) => {
      const formData = new FormData();
      if (params) {
        const keys = Object.keys(params);
        keys.forEach(key => {
          if (key !== 'img0') {
            formData.append(key, params[key]);
          } else {
            formData.append(key, params[key]);
          }
        });
      }
      try {
        axios
          .post(url, formData, {
            timeout: TIMEOUT,
            responseType: 'json',
            headers: headers,
          })
          .then(response => {
            if ([401].includes(response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, response?.data?.message ?? '');
            }
            resolve(response);
          })
          .catch(error => {
            if (
              !error?.response &&
              error?.message === alerts.networkError &&
              !this?.state?.isConnected
            ) {
              this.handleNoNetwork(() => {
                this.promiseUpdateProfileContainFile(
                  url,
                  params,
                  headers,
                )(resolve, reject);
              });
              return;
            }
            if ([401].includes(error?.response?.data?.status)) {
              this.handleUnAuthorize(() => {
                // this.promisePost(url, params, headers)(resolve, reject);
              }, error?.response?.data?.message ?? '');
            }
            reject(error?.response);
          });
      } catch (error) {
        reject(error?.response);
      }
    };
}

export default NetworkService;
