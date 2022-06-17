import {Alert} from 'react-native';

export const errorHandleAction = payload => () => {
  Alert.alert(payload.code, payload.message);
};
