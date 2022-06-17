import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../constants/colors';
import commonStyle from '../resource/styles/commonStyles';
import {navigateBackAction, navigationRef} from '../actions/navigationActions';
import {useDispatch} from 'react-redux';
const iconBack = require('../resource/images/arrow-back.png');

const ButtonBackComponent = ({handleBackStep, customStyle = {}}) => {
  function canGoBack() {
    return navigationRef?.current?.canGoBack() ?? false;
  }
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={[styles.container, customStyle]}
      hitSlop={commonStyle.hitSlop}
      onPress={() => {
        handleBackStep
          ? handleBackStep()
          : canGoBack()
          ? dispatch(navigateBackAction())
          : null;
      }}>
      <Image source={iconBack} style={{width: 30, height: 30}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 35,
    marginLeft: 24,
  },
});

export default ButtonBackComponent;
