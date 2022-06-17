import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {connect, useDispatch, useSelector} from 'react-redux';
import {ptByScreen} from '../utils/dimensUtil';
import colors from '../constants/colors';
import HomeScreen from '../containers/HomeScreen';
import routeNames from './routeNames';
import {isCheckedFcm} from '../selectors/appStateSelector';
import PropTypes from 'prop-types';
import {checkFcmPermission, clearAllFcmListeners} from '../actions/fcmActions';
import {AppState} from 'react-native';
import {configLocation} from '../actions/locationAction';

const Stack = createStackNavigator();

function StackNavigator(props, navigation) {
  const handleCheckedFcm = useSelector(isCheckedFcm);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const {configFcm, clearFcm} = props;
    if (!handleCheckedFcm) {
      configFcm();
    }

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      clearFcm();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (appState.current.match(/background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!!!!');
      dispatch(configLocation());
    }
    appState.current = nextAppState;
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: ptByScreen(55),
        },
        headerTintColor: colors.black,
      }}>
      <Stack.Screen
        name={routeNames.HomeScreen}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

StackNavigator.propTypes = {
  configFcm: PropTypes.func.isRequired,
  clearFcm: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  configFcm: () => dispatch(checkFcmPermission()),
  clearFcm: () => dispatch(clearAllFcmListeners()),
});

export default connect(null, mapDispatchToProps)(StackNavigator);
