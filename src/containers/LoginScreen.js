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
import {login} from '../repositories/service/authService';
import LoginRequest from '../repositories/remote/request/auth/LoginRequest';
import {
  getCodeUser,
  save,
  saveCodeUser,
  saveName,
  saveIpAddress,
} from '../repositories/local/sessionLocal';
import {setAppStateAction} from '../actions/appStateActions';
import {useDispatch} from 'react-redux';
import Validation from '../utils/validation';
import ButtonBackComponent from '../components/ButtonBackComponent';
import constant from '../constants/constant';
import {getUserLogin} from '../actions/userActions';
import {configLocation} from '../actions/locationAction';
import {useSelector} from 'react-redux';
import {ipAddressSelector} from '../selectors/appStateSelector';
import ImageLogoCustom from '../components/ImageLogoCustom';

function LoginScreen() {
  const [codeStaff, setCodeStaff] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const ipAddressLocal = useSelector(ipAddressSelector);
  useEffect(() => {
    Promise.all([getCodeUser()]).then(res => {
      if (res?.length) {
        setCodeStaff(res[0]);
      }
    });
  }, []);

  const invalid = () => {
    let errCodeStaffRq = Validation.required(codeStaff);
    if (!errCodeStaffRq) {
      setErrorMessage(Strings.codeStaffRqRequire);
      return true;
    }
    return false;
  };

  const handleLogin = () => {
    if (invalid()) {
      return;
    }
    const loginRequest = new LoginRequest();
    loginRequest.addParam('code', codeStaff);
    setErrorMessage('');
    login(loginRequest, res => {
      if (res?.isCode === 1) {
        save(res?.infor?.code);
        saveName(res?.infor?.face_id);
        saveCodeUser(res?.infor?.code);
        saveIpAddress(ipAddressLocal);
        dispatch(
          getUserLogin({code: res?.infor?.code, name: res?.infor?.face_id}),
        );
        dispatch(
          setAppStateAction({
            isLoggedIn: true,
          }),
        );
        dispatch(configLocation());
        setErrorMessage('');
      } else {
        setErrorMessage(Strings.errorCode);
      }
    });
  };
  return (
    <BackgroundImageComponent>
      <SafeAreaView style={[commonStyle.containerNoHeader]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{height: constant.HEIGHT - 50}}
            behavior={'padding'}
            keyboardVerticalOffset={50}>
            <ButtonBackComponent />
            <View
              style={[
                commonStyle.justifyAndAlignCenter,
                commonStyle.flex09,
                stylesLogin.container,
              ]}>
              {/* <ImageLogoComponent content="" /> */}
              <ImageLogoCustom/>
              <TextInputCustomComponent
                placeholder={Strings.placeholder}
                updateState={setCodeStaff}
                value={codeStaff}
                styleContainer={{marginTop: 24}}
                error={errorMessage}
              />
              <ButtonCustomComponent
                label={Strings.login}
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

export default LoginScreen;
