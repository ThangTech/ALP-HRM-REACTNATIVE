import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '.';

const IcFolder = ({ size = 32 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 72 72" preserveAspectRatio="xMidYMid meet">
    <G transform="translate(0, 72) scale(0.1, -0.1)" fill="#000000" stroke="none">
      <Path d="M65 641 c-45 -19 -46 -27 -46 -282 0 -231 2 -244 21 -263 20 -20 31 -21 320 -21 290 0 300 1 320 21 20 20 21 32 22 233 1 273 14 254 -186 257 l-145 2 -24 28 c-24 27 -27 28 -143 31 -66 1 -128 -1 -139 -6z m251 -36 c9 -6 28 -33 42 -60 l27 -50 125 3 c95 2 131 -1 145 -12 17 -12 19 -27 17 -186 0 -95 -5 -177 -10 -182 -5 -5 -140 -9 -303 -9 -266 0 -295 1 -306 17 -9 13 -12 74 -10 242 3 209 4 225 22 238 24 18 227 17 251 -1z m328 -51 c9 -4 21 -16 27 -27 10 -17 9 -19 -7 -13 -11 4 -74 7 -141 6 -111 -1 -123 1 -132 19 -10 18 -6 19 113 20 69 1 132 -2 140 -5z" />
    </G>
  </Svg>
);

export default IcFolder;
