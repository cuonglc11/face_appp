import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';

const {width} = Dimensions.get('window');
const FULL_HD_SCREEN_WIDTH = 1080;
const FULL_HD_SCREEN_HEIGHT = 1920;
const scale = width / FULL_HD_SCREEN_WIDTH;

export function pxToRateByWidth(px) {
  return `${(px / FULL_HD_SCREEN_WIDTH) * 100}%`;
}

export function pxToRateByHeight(px) {
  return `${(px / FULL_HD_SCREEN_HEIGHT) * 100}%`;
}

export function pxByScreen(px) {
  return px * scale;
}

export function ptByScreen(fontSize) {
  const newSize = fontSize * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

export function borderRadius(px) {
  return px * scale;
}

export function statusBarHeight() {
  return Platform.OS === 'android' ? StatusBar.currentHeight : 0;
}
