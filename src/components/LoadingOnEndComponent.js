import React from 'react';
import {ActivityIndicator} from 'react-native';

import colors from '../constants/colors';

const Loading = props => {
  return <ActivityIndicator {...props} color={colors.primary} />;
};

export default Loading;
