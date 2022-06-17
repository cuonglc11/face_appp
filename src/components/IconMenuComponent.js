import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import IconMenu from '../resource/icon/IconMenu';
import mainNavigatorStyle from '../resource/styles/mainNavigatorStyle';

export default function IconMenuComponent({navigation}) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => navigation.openDrawer()}
        style={[
          mainNavigatorStyle.blockIconMenu,
          {top: Platform.OS === 'ios' ? 70 : 24},
        ]}>
        <IconMenu fill={'blue'} />
      </TouchableOpacity>
    </>
  );
}
