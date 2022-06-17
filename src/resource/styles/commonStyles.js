import {Platform, StyleSheet} from 'react-native';
import constant from '../../constants/constant';
import colors from '../../constants/colors';

const commonStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: constant.INDENT,
    paddingTop: constant.HEADER_HEIGHT + 50,
  },
  containerContainHeader: {
    backgroundColor: colors.white,
    flex: 1,
  },

  containerNoHeader: {
    marginTop: Platform.OS === 'android' ? constant.HEADER_HEIGHT : 0,
    flex: 1,
    paddingTop: 12,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flex1: {
    flex: 1,
  },
  flex09: {
    flex: 0.9,
  },
  flex0: {
    flex: 0,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  alignSelfFlexEnd: {
    alignSelf: 'flex-end',
  },
  alignSelfFlexStart: {
    alignSelf: 'flex-start',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  marginRight10: {
    marginRight: 10,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  positionAbsolute: {
    position: 'absolute',
  },
  justifyAndAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyAndAlignContentBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hitSlop: {
    bottom: 15,
    left: 15,
    right: 15,
    top: 15,
  },
  containerModal: {
    width: constant.WIDTH,
    alignSelf: 'center',
    height: constant.HEIGHT,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingLeft: 32,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marginHorizontal24: {
    marginHorizontal: 24,
  },

  fullWeightHeight: {
    width: '100%',
    height: '100%',
  },
  shadowTextColor: {
    textShadowColor: colors.black,
    textShadowOffset: {width: -1.5, height: -1.5},
    textShadowRadius: 5,
  },
  width100: {
    width: '100%',
  },
  drawerStyle: {
    // width,
    // height: height * 0.65,
    backgroundColor: colors.backgroundMenu,
    paddingHorizontal: 30,
  },
  mt50: {
    marginTop: 50,
  },
  mt20: {
    marginTop: 20,
  }
});

export default commonStyle;
