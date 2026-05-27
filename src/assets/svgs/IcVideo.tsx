import * as React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { IconProps } from '.';

const IcVideo = ({ size = 24 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="vidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#3B82F6" />
      </LinearGradient>
      <LinearGradient id="vidGradFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
      </LinearGradient>
    </Defs>
    <Rect
      x="2"
      y="6"
      width="14"
      height="12"
      rx="2"
      ry="2"
      fill="url(#vidGradFill)"
      stroke="url(#vidGrad)"
      strokeWidth="1.5"
    />
    <Path
      d="M22 8l-6 3.5v1L22 16V8z"
      fill="url(#vidGradFill)"
      stroke="url(#vidGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IcVideo;
