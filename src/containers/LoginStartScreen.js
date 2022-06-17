import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text} from 'react-native';
import BackgroundImageComponent from '../components/BackgroundImageComponent';
import commonStyle from '../resource/styles/commonStyles';
import ImageLogoComponent from '../components/ImageLogoComponent';
import {Strings} from '../resource/Strings';
import ButtonCustomComponent from '../components/ButtonCustomComponent';
import {useDispatch, useSelector} from 'react-redux';
import {navigateAction} from '../actions/navigationActions';
import routeNames from '../navigators/routeNames';
import ButtonBackComponent from '../components/ButtonBackComponent';
import constant from '../constants/constant';
import {getIpAddress} from '../repositories/local/sessionLocal';
import ImageLogoCustom from '../components/ImageLogoCustom';

function LoginStartScreen() {
  const dispatch = useDispatch();
  const [ipAddress, setIpAddress] = useState('');
  useEffect(() => {
    Promise.all([getIpAddress()]).then(res => {
      if (res?.length) {
        setIpAddress(res[0]);
      }
    });
  }, []);

  return (
    <BackgroundImageComponent>
      {ipAddress === '' ? (
        <ButtonBackComponent
          customStyle={{
            position: 'absolute',
            paddingTop:
              Platform.OS === 'android'
                ? constant.HEADER_HEIGHT + 10
                : constant.HEADER_HEIGHT + 50,
            zIndex: 1,
          }}
        />
      ) : null}
      <SafeAreaView
        style={[
          commonStyle.justifyAndAlignCenter,
          stylesLoginStart.container,
          commonStyle.flex09,
        ]}>
        <ImageLogoCustom/>
        <Text numberOfLines={1} style={stylesLoginStart.textNote}>
          {Strings.description}
        </Text>
        <Text numberOfLines={2} style={{
          fontSize : 19,
          fontWeight :'bold'
        }}>
          {Strings.description_en}
        </Text>
        <ButtonCustomComponent
          label={Strings.login}
          onPress={() =>
            dispatch(navigateAction({name: routeNames.LoginScreen}))
          }
        />
      </SafeAreaView>
    </BackgroundImageComponent>
  );
}

const stylesLoginStart = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  textNote: {
    paddingVertical: 14,
    fontSize: 20,
  },
});

export default LoginStartScreen;
