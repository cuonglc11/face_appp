import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import colors from '../../constants/colors';

function IconBack(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || 20}
      height={props?.height || 20}
      viewBox="0 0 3.687 6.666"
      {...props}>
      <Path
        data-name="Path 925"
        d="M3.187.5L.355 3.332l2.832 2.832"
        fill="none"
        stroke={props?.color || colors.white}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.708}
      />
    </Svg>
  );
}

export default IconBack;
