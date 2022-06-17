import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.black,
    height: '100%',
    opacity: 0.45,
    position: 'absolute',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
});

function LoadingComponent(props) {
  const {modalVisible} = props;
  if (!modalVisible) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.background} />
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

LoadingComponent.propTypes = {
  modalVisible: PropTypes.bool,
};

LoadingComponent.defaultProps = {
  modalVisible: false,
};

export default LoadingComponent;
