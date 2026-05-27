import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '.';

const IcArrowRight = ({ size = 30 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G clip-path="url(#clip0_1005_22558)">
      <Path
        d="M9 6L15 12L9 18"
        stroke="#005BAB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1005_22558">
        <Rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default IcArrowRight;
