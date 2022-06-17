import React, {Component} from 'react';
import {View, Animated, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import progressiveImageStyle from '../resource/styles/progressiveImageStyles';
import colors from '../constants/colors';

const defaultImage = require('../resource/images/img-default-user.png');

class ProgressiveImage extends Component {
  thumbnailAnimated = new Animated.Value(1);

  imageAnimated = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const {
      thumbnailSource,
      source,
      containerStyle,
      thumbnailStyle,
      style,
      sizeLoading = 'small',
      color = colors.black,
      ...props
    } = this.props;
    const {isLoading} = this.state;
    return (
      <View style={[progressiveImageStyle.container, containerStyle]}>
        {isLoading ? (
          <Animated.View
            onLayout={this.handleThumbnailLoad}
            {...props}
            style={[
              style,
              thumbnailStyle,
              progressiveImageStyle.thumbnailStyle,
              {opacity: this.thumbnailAnimated},
            ]}
            onLoad={this.handleThumbnailLoad}
            blurRadius={1}>
            <ActivityIndicator size={sizeLoading} color={color} />
          </Animated.View>
        ) : null}
        <Animated.Image
          {...props}
          source={source ?? defaultImage}
          style={[
            progressiveImageStyle.imageOverlay,
            {opacity: this.imageAnimated},
            style,
          ]}
          onLoadStart={() => this.setState({isLoading: true})}
          onError={() => this.setState({isLoading: false})}
          onLoadEnd={() => this.setState({isLoading: false})}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}

ProgressiveImage.propTypes = {
  thumbnailSource: PropTypes.node,
  containerStyle: PropTypes.objectOf(PropTypes.any),
  thumbnailStyle: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
};

ProgressiveImage.defaultProps = {
  thumbnailSource: defaultImage,
  source: defaultImage,
  containerStyle: {},
  thumbnailStyle: {},
  style: {},
};

export default ProgressiveImage;
