import {Dimensions, StatusBar} from 'react-native';
const {width, height} = Dimensions.get('window');
// console.log();
const constant = {
  INDENT: 15,
  HEADER_HEIGHT: StatusBar.currentHeight,
  WIDTH: width,
  HEIGHT: height,
  BACKGROUND_IMAGE_LOGIN: require('../resource/images/background_dot.png'),
  LOGO_IMAGE: require('../resource/images/ic_log.png'),
  icon_date :  require('../resource/images/calendar.png')
};

export default constant;
