import * as React from 'react';
import Svg, {G, Rect} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function IconMenu(props) {
  return (
    <Svg width={36} height={26} viewBox="0 0 36 25.99" {...props}>
      <G id="prefix__Layer_2" data-name="Layer 2">
        <G id="prefix__\u80CC\u666F">
          <Rect fill="#0000ff" width={36} height={4.64} rx={1.9} />
          <Rect fill="#0000ff" y={10.67} width={36} height={4.64} rx={1.9} />
          <Rect fill="#0000ff" y={21.35} width={36} height={4.64} rx={1.9} />
        </G>
      </G>
    </Svg>
  );
}

export default IconMenu;
