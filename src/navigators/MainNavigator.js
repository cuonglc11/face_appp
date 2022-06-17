import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {connect} from 'react-redux';
import LoadingComponent from '../components/LoadingComponent';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import {loadAppStateAction} from '../actions/appStateActions';
import {navigationRef} from '../actions/navigationActions';
import NetworkService, {networkRef} from '../repositories/remote/network';
import SplashScreen from '../containers/SplashScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MenuComponent from '../components/MenuComponent';
import commonStyle from '../resource/styles/commonStyles';
const Drawer = createDrawerNavigator();

function MainNavigator(props) {
  const renderNavigator = () => {
    const {appState} = props;
    if (!appState.isLoaded) {
      return <SplashScreen />;
    }
    if (appState.isLoggedIn) {
      return (
        <Drawer.Navigator
          drawerPosition="right"
          drawerStyle={commonStyle.drawerStyle}
          drawerContent={props => <MenuComponent {...props} />}>
          <Drawer.Screen name="StackNavigator" component={StackNavigator} />
        </Drawer.Navigator>
      );
    }
    return <AuthNavigator />;
  };

  const renderLoading = () => {
    const {appState} = props;
    return <LoadingComponent modalVisible={appState.isLoading} />;
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {renderNavigator()}
      {renderLoading()}
      <NetworkService ref={networkRef} loadAppState={props.loadAppState} />
    </NavigationContainer>
  );
}

MainNavigator.propTypes = {};

MainNavigator.defaultProps = {
  appState: {},
};

const mapStateToProps = state => ({
  appState: state.appState,
});
const mapDispatchToProps = dispatch => ({
  loadAppState: payload => dispatch(loadAppStateAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
