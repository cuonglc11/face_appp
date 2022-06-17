import actionTypes from './types';

export const loadAppStateAction = payload => ({
  type: actionTypes.APP_STATE_LOADED,
  payload,
});

export const startLoadingAction = appState => ({
  type: actionTypes.START_LOADING,
  payload: appState,
});

export const setAppStateAction = appState => ({
  type: actionTypes.APP_STATE_SET,
  payload: appState,
});

export const stopLoadingAction = appState => ({
  type: actionTypes.STOP_LOADING,
  payload: appState,
});

export const toggleFab = appState => ({
  type: actionTypes.SHOWING_FAB,
  payload: appState,
});

export const loginSuccess = () => ({
  type: actionTypes.LOGIN_SUCCESS,
});

export const logoutAction = payload => ({
  type: actionTypes.USER_LOGOUT,
  payload,
});

export const showLoadingAction = payload => dispatch => {
  if (payload) {
    dispatch(startLoadingAction(payload));
  } else {
    dispatch(stopLoadingAction(payload));
  }
};
