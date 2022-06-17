import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
// import SendLocationRequest from '../repositories/remote/request/area/SendLocationRequest';
// import {saveLocation} from '../repositories/service/areaService';

export const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('always');
    return status === 'granted';
  }
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
  return await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
};

export const requestLocationPermission = () => async dispatch => {
  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('always');
    return;
  }
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
};

export const configLocation = () => async dispatch => {
  checkLocationPermission().then(enable => {
    console.log(enable, 'enable');
    if (enable) {
      dispatch(getLocation());
    } else {
      dispatch(requestLocationPermission());
    }
  });
};

export const getLocation = payload => dispatch => {
  Geolocation.getCurrentPosition(
    position => {
      console.log(position, 'position');
      if (payload?.onSuccess) {
        payload.onSuccess(position?.coords);
      }
      // dispatch(sendLocation(position));
    },
    error => {
      console.log(error, 'ERROR');
      if (payload?.onFailed) {
        payload.onFailed(error);
      }
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
};

// export const sendLocation = payload => dispatch => {
//   const longitude = payload.coords.longitude;
//   const latitude = payload.coords.latitude;
//   const saveLocationRequest = new SendLocationRequest();
//   saveLocationRequest.addParam(SendLocationRequest.Keys.latitude, latitude);
//   saveLocationRequest.addParam(SendLocationRequest.Keys.longitude, longitude);
//   saveLocation(saveLocationRequest, res => {
//     console.log(res);
//   });
// };
