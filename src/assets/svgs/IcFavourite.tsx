import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcFavorite = ({ size = 30, style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25.932 22.999" style={style}>
    <Path
      id="favorite"
      d="M23.618,31.262a7.914,7.914,0,0,0-10.652-.491A7.913,7.913,0,0,0,2.313,42.452l8.676,8.676a2.8,2.8,0,0,0,3.953,0l8.676-8.676A7.921,7.921,0,0,0,23.618,31.262ZM22.543,41.377l-8.676,8.676a1.281,1.281,0,0,1-1.8,0L3.388,41.377a6.392,6.392,0,0,1,9.04-9.04.76.76,0,0,0,1.075,0,6.392,6.392,0,1,1,9.04,9.04Z"
      transform="translate(0 -28.945)"
      fill="#666"
    />
  </Svg>
);
export default IcFavorite;
