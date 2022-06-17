import {combineReducers} from 'redux';
import appStateReducer from './appStateReducer';
import authReducer from './authReducer';
import actionTypes from '../actions/types';
import userStateReducer from './userStateReducer';

const appReducer = combineReducers({
  appState: appStateReducer,
  auth: authReducer,
  userState: userStateReducer,
});

const rootReducer = (state, action) => {
  const newState =
    action.type === actionTypes.USER_LOGOUT
      ? {
          appState: {
            ...state.appState,
            isLoggedIn: false,
          },
        }
      : state;

  return appReducer(newState, action);
};

export default rootReducer;
