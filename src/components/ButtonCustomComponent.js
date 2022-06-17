import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../constants/colors';
const TIME_LOCK_BUTTON = 2000;

const ButtonCustomComponent = ({
  customStyle = {},
  label,
  onPress,
  customStyleText = {},
  ...props
}) => {
  const [disableButton, setDisableButton] = useState(false);
  const timeoutDisableButtonId = useRef(null);
  const timeOut = () => {
    timeoutDisableButtonId.current = setTimeout(() => {
      setDisableButton(false);
    }, TIME_LOCK_BUTTON);
  };
  useEffect(() => {
    return function cleanUp() {
      clearTimeout(timeoutDisableButtonId.current);
    };
  }, []);
  return (
    <TouchableOpacity
      disableButton={disableButton}
      activeOpacity={0.9}
      onPress={() => {
        setDisableButton(true);
        timeOut();
        onPress();
      }}
      {...props}
      style={[styles.buttonContainer, customStyle]}>
      <Text numberOfLines={1} style={[styles.textButton, customStyleText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorButton,
    borderRadius: 12,
    marginTop: 12,
    padding: 6,
  },
  textButton: {
    fontSize: 18,
    color: colors.white,
    padding: 12,
    fontWeight: 'bold',
  },
});

export default ButtonCustomComponent;
