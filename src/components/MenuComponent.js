import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import mainNavigatorStyle from '../resource/styles/mainNavigatorStyle';
import routeNames from '../navigators/routeNames';
import {useDispatch, useSelector} from 'react-redux';
import {navigateAction, resetRouteAction} from '../actions/navigationActions';
import {userLoginSelector} from '../selectors/userSelector';
import {Strings} from '../resource/Strings';
import colors from '../constants/colors';
import {logoutAction} from '../actions/appStateActions';
import {clearAllFcmListeners, removeFcmAction} from '../actions/fcmActions';
import {
  clearAccessToken,
  clearNameUser,
} from '../repositories/local/sessionLocal';
import ButtonCustomComponent from './ButtonCustomComponent';
import commonStyle from '../resource/styles/commonStyles';
function MenuComponent() {
  const dispatch = useDispatch();
  const userLoginTor = useSelector(userLoginSelector);
  return (
    <View
      style={[
        commonStyle.justifyAndAlignCenter,
        {marginTop: Platform.OS === 'ios' ? 100 : 70},
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => dispatch(navigateAction({name: routeNames.HomeScreen}))}
        style={mainNavigatorStyle.blockItemMenu}>
        <Text style={{color: colors.white, fontSize: 18}}>{'Trang chủ'}</Text>
      </TouchableOpacity>
      <ButtonCustomComponent
        label={Strings.logout}
        customStyle={styles.btnLogout}
        customStyleText={{color: colors.lightNavy, fontSize: 15}}
        onPress={() => {
          dispatch(logoutAction());
          dispatch(removeFcmAction(userLoginTor));
          dispatch(clearAllFcmListeners());
          clearAccessToken();
          clearNameUser();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnLogout: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    width: '70%',
    paddingVertical: 0,
  },
});

export default MenuComponent;
