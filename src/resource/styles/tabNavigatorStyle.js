import {StyleSheet, Platform} from 'react-native';

const tabNavigatorStyle = StyleSheet.create({
  icons: {
    height: 22,
    resizeMode: 'contain',
    width: 24,
    marginTop: Platform.OS === 'ios' ? 12 : 8,
  },
});

export default tabNavigatorStyle;
