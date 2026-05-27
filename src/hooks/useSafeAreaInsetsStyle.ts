import { FlexStyle, Platform } from 'react-native';
import { Edge, EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { verticalScale } from 'utils';

const propertySuffixMap = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Start',
  right: 'End',
  start: 'Start',
  end: 'End',
};

const edgeInsetMap = {
  start: 'left',
  end: 'right',
};

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Utils-useSafeAreaInsetsStyle.md)
 */
export function useSafeAreaInsetsStyle(
  safeAreaEdges: ExtendedEdge[] = [],
  property: 'padding' | 'margin' = 'padding',
): Pick<
  FlexStyle,
  | 'marginBottom'
  | 'marginEnd'
  | 'marginStart'
  | 'marginTop'
  | 'paddingBottom'
  | 'paddingEnd'
  | 'paddingStart'
  | 'paddingTop'
> {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce(
    (acc, e) => ({
      ...acc,
      [`${property}${propertySuffixMap[e]}`]:
        insets[(edgeInsetMap[e as 'start' | 'end'] ?? e) as Edge],
    }),
    {},
  );
}

export const useSafeArea = () => {
  const { bottom, top, right, left } = useSafeAreaInsets();

  return {
    top,
    bottom: Platform.OS === 'ios' ? bottom || verticalScale(8) : bottom + verticalScale(8),
    right,
    left,
  };
};

export type ISafeAreaInsetsStyle = Pick<
  FlexStyle,
  | 'marginBottom'
  | 'marginEnd'
  | 'marginStart'
  | 'marginTop'
  | 'paddingBottom'
  | 'paddingEnd'
  | 'paddingStart'
  | 'paddingTop'
>;

export function useSafeAreaInsetsStyleExtend(
  safeAreaEdgesMap: { [key in ExtendedEdge]?: number } = {},
  property: 'padding' | 'margin' = 'padding',
): ISafeAreaInsetsStyle {
  const insets = useSafeAreaInsets();

  const res: ISafeAreaInsetsStyle = {};
  for (const edge in safeAreaEdgesMap) {
    const insetValue = insets[(edgeInsetMap[edge as 'start' | 'end'] ?? edge) as keyof EdgeInsets];
    res[
      `${property}${
        propertySuffixMap[edge as keyof typeof propertySuffixMap]
      }` as keyof ISafeAreaInsetsStyle
    ] = (((safeAreaEdgesMap as any)?.[edge] ?? 0) as number) + insetValue;
  }
  return res;
}
