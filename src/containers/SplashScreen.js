// eslint-disable-next-line no-unused-vars
import React, {useCallback, useEffect} from 'react';
import {
  getAccessToken, getIpAddress,
  getNameUser,
  getRefreshToken,
} from '../repositories/local/sessionLocal';
import {
  loadAppStateAction,
  loginSuccess,
  setAppStateAction,
} from '../actions/appStateActions';
import {useDispatch} from 'react-redux';
import RNSplashScreen from 'react-native-splash-screen';
import {getUserLogin} from '../actions/userActions';

const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    RNSplashScreen.hide();
    asyncLoadAppStateAction();
  }, []);

  const asyncLoadAppStateAction = useCallback(() => {
    Promise.all([
      getAccessToken(),
      getRefreshToken(),
      getNameUser(),
      getIpAddress(),
    ])
      .then(([accessToken, refreshToken, nameUser, ipAddress]) => {
        dispatch(getUserLogin({code: accessToken, name: nameUser}));
        console.log(accessToken, 'accessToken', ipAddress);
        if (accessToken) {
          dispatch(
            loginSuccess({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
          );
        }
        dispatch(
          setAppStateAction({
            isLoggedIn: !!accessToken,
            ipAddress: ipAddress ?? '',
          }),
        );
        setTimeout(() => {
          dispatch(loadAppStateAction());
        }, 200);
      })
      .catch(console.log);
  }, [dispatch]);
  return null;
};

export default SplashScreen;
