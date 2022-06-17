import React from 'react';
import type {Node} from 'react';
import {Provider} from 'react-redux';
import {NativeModules} from 'react-native';
import store from './src/store';
import MainNavigator from './src/navigators/MainNavigator';
import 'react-native-gesture-handler';

const {UIManager} = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App: () => Node = () => {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;
