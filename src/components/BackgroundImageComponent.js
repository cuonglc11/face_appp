import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import constant from '../constants/constant';
import colors from '../constants/colors';

function BackgroundImageComponent({children}) {
  return (
    <ImageBackground
      source={constant.BACKGROUND_IMAGE_LOGIN}
      resizeMode="repeat"
      style={styles.background}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default BackgroundImageComponent;
