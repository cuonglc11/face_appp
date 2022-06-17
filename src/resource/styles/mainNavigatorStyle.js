import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
const {width, height} = Dimensions.get('window');

const mainNavigatorStyle = StyleSheet.create({
  avatar: {
    borderRadius: 80,
    height: 80,
    marginBottom: 8,
    width: 80,
  },
  badgerIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: 100,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    top: -1,
    width: 20,
  },
  badgerLabel: {
    color: colors.white,
  },
  blockAvatar: {
    alignItems: 'center',
    marginBottom: 24,
  },
  blockIconMenu: {
    marginRight: 12,
    position: 'absolute',
    right: -12,
  },
  blockItemMenu: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.white,
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 8,
    width: '100%',
  },
  blockMenu: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.backgroundMenu,
  },
  blockVersion: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSafeArea: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  iconMenu: {
    marginRight: 12,
  },
  iconMenuShake: {
    marginRight: 8,
  },
  tabBar: {
    backgroundColor: colors.green,
    height: 55,
  },
  textVersion: {
    color: colors.blue,
  },
  topSafeArea: {
    backgroundColor: colors.colorBlue,
    flex: 0,
  },
});

export default mainNavigatorStyle;
