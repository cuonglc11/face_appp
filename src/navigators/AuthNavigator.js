import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import routeNames from './routeNames';
import LoginStartScreen from '../containers/LoginStartScreen';
import LoginScreen from '../containers/LoginScreen';
import ChangeIPScreen from '../containers/ChangeIPScreen';
import {getIpAddress} from '../repositories/local/sessionLocal';

const Stack = createStackNavigator();

function AuthNavigator(props) {
  const [ipAddress, setIpAddress] = useState('');
  useEffect(() => {
    Promise.all([getIpAddress()]).then(res => {
      if (res?.length) {
        setIpAddress(res[0]);
      }
    });
  }, []);
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name={routeNames.ChangeIPScreen}
          component={!ipAddress ? ChangeIPScreen : LoginStartScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routeNames.LoginStartScreen}
          component={LoginStartScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routeNames.LoginScreen}
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      </>
    </Stack.Navigator>
  );
}

export default AuthNavigator;
