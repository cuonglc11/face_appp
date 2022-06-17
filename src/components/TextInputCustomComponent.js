import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Keyboard,
} from 'react-native';
import colors from '../constants/colors';

const TextInputCustomComponent = ({
  value,
  label,
  keyboardType,
  placeholder,
  placeholderColor,
  updateState,
  error,
  errorValidate,
  styleCustom,
  styleContainer,
  isPassword = false,
  ...props
}) => {
  return (
    <View style={{width: '100%'}}>
      <View
        style={[
          stylesInput.container,
          styleContainer,
          error && stylesInput.inputError,
        ]}>
        <TextInput
          {...props}
          value={value}
          secureTextEntry={isPassword}
          keyboardType={'default'}
          returnKeyType={'done'}
          style={[stylesInput.textInput, styleCustom]}
          onChangeText={text => updateState(text)}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
        />
        {error ? <View style={stylesInput.borderBottom} /> : <View />}
      </View>
      {error ? <Text style={stylesInput.error}>{error}</Text> : null}
    </View>
  );
};

const stylesInput = StyleSheet.create({
  container: {
    borderColor: colors.colorInput,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginVertical: 12,
  },
  textInput: {
    height: 50,
    width: '100%',
    marginTop: 4,
  },
  inputError: {
    borderWidth: 2,
    borderColor: colors.red,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: colors.grayLight,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 0 : 3,
  },
});

export default TextInputCustomComponent;
