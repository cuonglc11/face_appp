import {Platform} from 'react-native';
import {messaging, notifications} from 'react-native-firebase';
import actionTypes from './types';
import store from '../store';

import {errorHandleAction} from './errorHandleActions.';
import {
  clearFcmLocalToken,
  getFcmLocalToken,
  setFcmLocalToken,
} from '../repositories/local/fcmLocal';
import {navigateAction} from './navigationActions';
import routeNames from '../navigators/routeNames';
import CommonRequest from '../repositories/remote/request/CommonRequest';
import {removeFcmToken, saveFcmToken} from '../repositories/service/userService';

export const setFcmTokenAction = payload => ({
  type: actionTypes.FCM_SET_TOKEN,
  payload,
});

export const registerFcmAction = payload => ({
  type: actionTypes.FCM_REGISTER_TOKEN,
  payload,
});

export const addFcmListenerAction = payload => ({
  type: actionTypes.FCM_ADD_LISTENER,
  payload,
});

export const clearAllFcmListenersAction = () => ({
  type: actionTypes.FCM_CLEAR_ALL_LISTENER,
});

export const clearAllFcmListeners = () => dispatch => {
  const {appState} = store.getState();

  if (appState && appState.fcmListeners) {
    appState.fcmListeners.forEach(listenerUnsubscribe => listenerUnsubscribe());
  }
  dispatch(clearAllFcmListenersAction());
};

export const registerFcmToken = payload => dispatch => {
  const {userState} = store.getState();
  const request = new CommonRequest();
  request.addParam('code', userState?.user?.code);
  request.addParam('fcm_token', payload);

  saveFcmToken(request, res => {
    if (res?.success === 1) {
      dispatch(registerFcmAction(true));
    } else {
      dispatch(registerFcmAction(false));
      setTimeout(() => registerFcmToken(payload), 60000);
    }
  });
};

const openNotificationAction = payload => async dispatch => {
  if (payload && payload.notification && payload.notification.data) {
    dispatch(navigateAction({name: routeNames.HomeScreen}));
  }
};

const createAndroidPushChannel = () => {
  const channelId = new notifications.Android.Channel(
    'checkin_push_channel',
    'Default',
    notifications.Android.Importance.Max,
  );
  notifications().android.createChannel(channelId);
};

const displayNotification = notification => {
  try {
    const {data, title, body} = notification;
    const {fcm_options: fcmOptions} = data;
    const display = new notifications.Notification({
      data,
      sound: 'default',
      show_in_foreground: true,
      title,
      body,
    });
    if (Platform.OS === 'android') {
      display.android
        .setPriority(notifications.Android.Priority.Max)
        .android.setColor('#ff0000')
        .android.setChannelId('checkin_push_channel')
        // .android.setSmallIcon('ic_launcher_foreground')
        // .android.setLargeIcon('ic_launcher_foreground')
        .android.setVibrate(1000)
        .android.setAutoCancel(true);
    }
    notifications()
      .displayNotification(display)
      .then(r => {});
  } catch (err) {
    console.log(err);
  }
};

export const handleNewFcmMessage = () => dispatch => {
  createAndroidPushChannel();
  notifications()
    .getInitialNotification()
    .then(payload => {
      dispatch(openNotificationAction(payload));
    });
  const onNotificationOpened = notifications().onNotificationOpened(payload => {
    dispatch(openNotificationAction(payload));
  });
  const onNotification = notifications().onNotification(async notification => {
    displayNotification(notification);
  });
  dispatch(addFcmListenerAction([onNotificationOpened, onNotification]));
};

export const refreshToken = () => dispatch => {
  messaging()
    .getToken()
    .then(fcmToken => {
      setFcmLocalToken(fcmToken);
      dispatch(setFcmTokenAction(fcmToken));
      dispatch(registerFcmToken(fcmToken));
    });
};

export const handleNewFcmToken = () => dispatch => {
  const onTokenRefresh = messaging().onTokenRefresh(() => {
    dispatch(refreshToken());
  });
  dispatch(addFcmListenerAction([onTokenRefresh]));
};

export const getFcmToken = () => dispatch => {
  getFcmLocalToken().then(token => {
    console.log(token, 'device_token');
    if (!token) {
      dispatch(refreshToken());
      return;
    }
    dispatch(handleNewFcmToken());
    dispatch(setFcmTokenAction(token));
    dispatch(registerFcmToken(token));
  });
};

export const requestPermission = () => dispatch => {
  messaging()
    .requestPermission()
    .then(() => {
      // User has authorised
      dispatch(getFcmToken());
      dispatch(handleNewFcmMessage());
    })
    .catch(error => {
      // User has rejected permissions
      // TODO: should be fix error handle after react-native-firebase fix the issue
      // TODO: https://github.com/invertase/react-native-firebase/issues/1865
      dispatch(errorHandleAction());
      console.log(error);
    });
};

export const checkFcmPermission = () => dispatch => {
  messaging()
    .hasPermission()
    .then(enabled => {
      if (enabled) {
        dispatch(getFcmToken());
        dispatch(handleNewFcmMessage());
      } else {
        dispatch(getFcmToken());
        dispatch(requestPermission());
      }
    });
};

export const removeFcmAction = payload => dispatch => {
  const {appState} = store.getState();

  if (appState.fcmToken) {
    const request = new CommonRequest();
    request.addParam('code', payload?.code);
    request.addParam('fcm_token', appState.fcmToken);
    removeFcmToken(request, (res) => {
      dispatch(setFcmTokenAction(''));
      dispatch(registerFcmAction(false));
      clearFcmLocalToken();
    });
  }
};
