import {createRef} from 'react';
import {CommonActions} from '@react-navigation/native';

export const navigationRef = createRef();

export const navigateAction = payload => dispatch => {
  return navigationRef.current?.navigate(payload.name, payload.params, () => {
    if (payload.callback) {
      dispatch(payload.callback);
    }
  });
};

export const navigateBackAction = () => () => navigationRef.current?.goBack();

export const deepNavigateAction = payload => dispatch => {
  return navigationRef.current?.dispatch(payload, () => {
    if (payload.callback) {
      dispatch(payload.callback);
    }
  });
};

export const resetRouteAction = () => () => {
  const resetRoute = CommonActions.reset({
    index: 1,
    routes: [{name: 'Home'}],
  });
  return navigationRef.current?.dispatch(resetRoute);
};
