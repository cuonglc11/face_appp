import actionTypes from '../actions/types';

const initializedState = {
  isLoaded: false,
  isLoggedIn: false,
  isShowingFab: false,
  isLoading: false,
  fcmToken: '',
  fcmListeners: [],
  handleCheckedFcm: false,
  ipAddress: '',
};

const appStateReducer = (state = initializedState, action) => {
  const {fcmListeners} = state;
  switch (action.type) {
    case actionTypes.APP_STATE_LOADED:
      return {
        ...state,
        ...action.payload,
        isLoaded: true,
      };
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.SHOWING_FAB:
      return {
        ...state,
        isShowingFab: action.payload,
      };
    case actionTypes.APP_STATE_SET:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isShowingFab: true,
      };
    case actionTypes.FCM_SET_TOKEN:
      return {
        ...state,
        fcmToken: action.payload,
      };
    case actionTypes.FCM_REGISTER_TOKEN:
      return {
        ...state,
        fcmRegistered: action.payload,
      };
    case actionTypes.FCM_ADD_LISTENER:
      return {
        ...state,
        fcmListeners: fcmListeners.concat(action.payload),
      };
    case actionTypes.FCM_CLEAR_ALL_LISTENER:
      return {
        ...state,
        fcmListeners: [],
      };
    default:
      return state;
  }
};

export default appStateReducer;
