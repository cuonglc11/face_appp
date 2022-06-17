import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import constant from '../constants/constant';
import commonStyle from '../resource/styles/commonStyles';
import colors from '../constants/colors';

function ImageLogoComponent({
  content,
  customImageLogo = {},
  isShowHello = false,
}) {
  console.log(content , "content");
  return (
    <View style={{flexDirection:'row' }}>
     <View style={{flex:0.5}}>
     <Image
        style={[stylesLogo.imageLogo, customImageLogo]}
        resizeMode="contain"
        source={constant.LOGO_IMAGE}
      />
      </View>    
       <View style={{flex:1 , alignItems:'center',justifyContent:'center' }}>
       <Text numberOfLines={2} style={stylesLogo.textContent}>
        {isShowHello ? 'Xin chào: ' + content : content}
      </Text>
       </View>
    </View>
  );
}

const stylesLogo = StyleSheet.create({
  imageLogo: {
    width: constant.WIDTH / 3.4,
    height: constant.HEIGHT / 4,
  },
  textContent: {
    // fontSize: 16,
    // marginStart : 1,
    fontWeight: 'bold',
    alignSelf :'center',
    color: colors.lightNavy,
  },
});

export default ImageLogoComponent;
