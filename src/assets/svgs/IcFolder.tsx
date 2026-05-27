import * as React from 'react';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { IconProps } from '.';
const IcFolder = ({ size = 30 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <G id="Group_213" data-name="Group 213" transform="translate(-33 -393)">
      <G
        id="Ellipse_21"
        data-name="Ellipse 21"
        transform="translate(33 393)"
        fill="none"
        stroke="#707070"
        strokeWidth={1}
        opacity={0.1}
      >
        <Circle cx={20} cy={20} r={20} stroke="none" />
        <Circle cx={20} cy={20} r={19.5} fill="none" />
      </G>
      <Path
        id="folder_2_"
        data-name="folder (2)"
        d="M19.163,10.833H18V8.744a.912.912,0,0,0-.911-.911H8.838L7.172,5.5H.911A.912.912,0,0,0,0,6.411V20.973H0a.851.851,0,0,0,.853.86h14.92a.846.846,0,0,0,.817-.6L20,11.883v-.059A.893.893,0,0,0,19.163,10.833ZM.667,6.411a.244.244,0,0,1,.244-.244H6.828L8.495,8.5h8.594a.244.244,0,0,1,.244.244v2.089H4.244a.855.855,0,0,0-.816.6L.667,18.966Zm15.29,14.617a.189.189,0,0,1-.182.139H.855a.184.184,0,0,1-.149-.074.181.181,0,0,1-.041-.136l3.4-9.318a.189.189,0,0,1,.182-.139h14.92c.127,0,.159.182.167.273Z"
        transform="translate(43 399.5)"
        fill="#7b7b7b"
      />
    </G>
  </Svg>
);
export default IcFolder;
