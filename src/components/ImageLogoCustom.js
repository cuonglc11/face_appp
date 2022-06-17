import React from "react"
import {View , Text , Image , StyleSheet} from 'react-native'
import colors from "../constants/colors"
import constant from "../constants/constant"
import commonStyle from "../resource/styles/commonStyles"
const ImageLogoCustom = ({}) => {
    return (
        <View style={commonStyle.justifyAndAlignCenter}>
             <Image
             style={[stylesLogo.imageLogo ]}
              resizeMode="contain"
              source={constant.LOGO_IMAGE}
             />
        </View>
    )  
}
const stylesLogo = StyleSheet.create({
    imageLogo: {
      width: constant.WIDTH / 1,
      height: constant.HEIGHT / 4,
    },
    textContent: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.lightNavy,
    },
  });
  export default ImageLogoCustom