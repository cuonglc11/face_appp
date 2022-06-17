import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import BackgroundImageComponent from '../components/BackgroundImageComponent';
import commonStyle from '../resource/styles/commonStyles';
import ImageLogoComponent from '../components/ImageLogoComponent';
import {Strings} from '../resource/Strings';
import ButtonCustomComponent from '../components/ButtonCustomComponent';
import TextInputCustomComponent from '../components/TextInputCustomComponent';
import {useDispatch} from 'react-redux';
import Validation from '../utils/validation';
import constant from '../constants/constant';
import {navigateAction} from '../actions/navigationActions';
import routeNames from '../navigators/routeNames';
import {setAppStateAction} from '../actions/appStateActions';

function ChangeIPScreen() {
  const [ipCommon, setIpCommon] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const invalid = () => {
    let errRequire = Validation.required(ipCommon);
    let errRegexIp = Validation.validateIpAddress(ipCommon);
    if (!errRequire) {
      setErrorMessage(Strings.ipRequired);
      return true;
    }
    if (!errRegexIp) {
      setErrorMessage(Strings.ipRegex);
      return true;
    }
    return false;
  };

  const handleLogin = () => {
    if (invalid()) {
      return;
    }
    setErrorMessage(null);
    dispatch(navigateAction({name: routeNames.LoginStartScreen}));
    dispatch(
      setAppStateAction({
        ipAddress: `http://${ipCommon}:8003/`,
      }),
    
    );
  };
  return (
    <BackgroundImageComponent>
      <SafeAreaView style={[commonStyle.containerNoHeader]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{height: constant.HEIGHT - 50}}
            behavior={'padding'}
            keyboardVerticalOffset={50}>
            <View
              style={[
                commonStyle.justifyAndAlignCenter,
                commonStyle.flex09,
                stylesLogin.container,
              ]}>
              <ImageLogoComponent content="" />
              <TextInputCustomComponent
                placeholder={Strings.placeholderIp}
                updateState={setIpCommon}
                value={ipCommon}
                styleContainer={{marginTop: 24}}
                error={errorMessage}
              />
              <ButtonCustomComponent
                label={Strings.btnIp}
                onPress={handleLogin}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </BackgroundImageComponent>
  );
}

const stylesLogin = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  textNote: {
    paddingVertical: 14,
    fontSize: 16,
  },
});

export default ChangeIPScreen;
