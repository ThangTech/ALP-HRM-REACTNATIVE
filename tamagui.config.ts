// @tamagui/core doesn't include `createMedia` so that it can avoid
// a dependency on react-native. If you are using tamagui, you can
// import createMedia from there directly and avoid this line:
import { createFont, createTamagui, createTokens } from 'tamagui';

// Create a font:

// To work with the tamagui UI kit styled components (which is optional)
// you'd want the keys used for `size`, `lineHeight`, `weight` and
// `letterSpacing` to be consistent. The `createFont` function
// will fill-in any missing values if `lineHeight`, `weight` or
// `letterSpacing` are subsets of `size`.

const interFont = createFont({
  family: 'Inter, Helvetica, Arial, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 15,
  },
  lineHeight: {
    // 1 will be 22
    2: 22,
  },
  weight: {
    1: '300',
    // 2 will be 300
    3: '600',
  },
  letterSpacing: {
    1: 0,
    2: -1,
    // 3 will be -1
  },
  // (native only) swaps out fonts by face/style
  face: {
    300: { normal: 'InterLight', italic: 'InterItalic' },
    600: { normal: 'InterBold' },
  },
});

// Set up our tokens

// The keys can be whatever you want, but we do recommend keeping them
// consistent across the different token categories and intended for
// usage together to make nice designs - eg for a Button to use.

const size = {
  true: 10, // this means "md" is your default size
  sm: 2,
  md: 10,
  lg: 20,
};

export const tokens = createTokens({
  size,
  space: { ...size, '-1': -5, '-2': -10 },
  radius: { 0: 0, 1: 2, true: 0 },
  zIndex: { 0: 0, 1: 100, 2: 200, true: 0 },
  color: {
    // Required Tamagui tokens
    background: '#F2F7FC',
    backgroundHover: '#E8F2FF',
    backgroundPress: '#D4E8FF',
    backgroundFocus: '#C0DEFF',
    backgroundStrong: '#FFFFFF',
    backgroundHeader: '#005BAB',
    backgroundTransparent: 'transparent',

    color: '#212121',
    colorHover: '#000000',
    colorPress: '#000000',
    colorFocus: '#000000',
    colorTransparent: 'transparent',

    borderColor: '#DEE2E6',
    borderColorHover: '#C0C8D0',
    borderColorPress: '#A8B2BC',
    borderColorFocus: '#90A0A8',
    borderColorTransparent: 'transparent',

    placeholderColor: '#89939E',
    placeholderColorHover: '#717171',
    placeholderColorPress: '#4D4D4D',
    placeholderColorFocus: '#4D4D4D',

    // Custom app tokens
    bg: '#F2F7FC',

    black: '#212121',
    white: '#FFFFFF',
    d_grey: '#4D4D4D',
    grey: '#717171',
    l_Grey: '#89939E',
    grey_blue: '#ABBED1',
    silver: '#F5F7FA',
    border: '#DEE2E6',
    shadow: '#D6D6D6',

    blue950: '#0a2b61',
    blue800: '#0049bc',
    blue700: '#0063ff',
    blue500: '#149dff',
    blue300: '#7dd8ff',
    blue100: '#d4f0ff',
    blue50: '#ecf9ff',
    blue: '#007ACC',
    blue2: '#077AFF',
    blue3: '#005BAB',

    d_green: '#115B43',
    forest: '#1B6E53',
    m_green: '#009262',
    herbal: '#32C997',
    mint: '#84DFC1',
    l_green: '#F1FBF8',
    expiry: '#2E9D00',

    d_yellow: '#E48900',
    lemon: '#FFA826',
    m_yellow: '#FFB240',
    straw: '#FFC670',
    sand: '#FFD596',
    l_yellow: '#FFF8EC',

    d_red: '#C33025',
    scarlet: '#E01507',
    m_red: '#E02B1D',
    raspberry: '#FF5A4F',
    rubicund: '#F0857D',
    l_red: '#FFF1F0',
    approvedBg: '#B0E799',
    approvedText: '#38761D',
    pendingBg: '#FFE599',
    pendingText: '#DEA500',
    detractiveBg: '#FEECEB',
    detractive: '#F04438',
    red500: '#F04438',
    orange: '#EF8536',
    divider: '#E7E7E8',
    reportBorderColor: '#EBEBEB',
    secondary: '#8D2929',
    bgLeave: '#F4F6F8',
    m_light: '#45484F',
    d_light: '#737373',
    inputDisable: '#D9D9D9',
    insuranceContinue: '#A3DDD6',
    insuranceExpired: '#DDBCA3',
    titleTicket: '#0015FF',
  },
});

const config = createTamagui({
  fonts: {
    // for tamagui, heading and body are assumed
    heading: interFont,
    body: interFont,
  },
  tokens,

  // For more on themes, see the Themes page
  themes: {
    light: {
      bg: '#f2f2f2',
      color: tokens.color.black,
    },
    dark: {
      bg: '#111',
      color: tokens.color.white,
    },
  },

  // Shorthands
  // Adds <View m={10} /> to <View margin={10} />
  // See Settings section on this page to only allow shorthands
  // Be sure to have `as const` at the end
  shorthands: {
    // Spacing
    p: 'padding',
    ph: 'paddingHorizontal',
    pv: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m: 'margin',
    mh: 'marginHorizontal',
    mv: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',

    // Flexbox
    f: 'flex',
    fd: 'flexDirection',
    ai: 'alignItems',
    jc: 'justifyContent',
    as: 'alignSelf',
    fw: 'flexWrap',
    fs: 'flexShrink',
    fg: 'flexGrow',

    // Size
    w: 'width',
    h: 'height',
    minW: 'minWidth',
    maxW: 'maxWidth',
    minH: 'minHeight',
    maxH: 'maxHeight',

    // Borders
    bw: 'borderWidth',
    btw: 'borderTopWidth',
    bbw: 'borderBottomWidth',
    blw: 'borderLeftWidth',
    brw: 'borderRightWidth',
    br: 'borderRadius',
    btlr: 'borderTopLeftRadius',
    btrr: 'borderTopRightRadius',
    bblr: 'borderBottomLeftRadius',
    bbrr: 'borderBottomRightRadius',

    // Colors
    bg: 'backgroundColor',
    bc: 'borderColor',
    btc: 'borderTopColor',
    bbc: 'borderBottomColor',
    blc: 'borderLeftColor',
    brc: 'borderRightColor',
    c: 'color',

    // Typography
    s: 'fontSize',
    fontW: 'fontWeight',
    ta: 'textAlign',
    lh: 'lineHeight',
    ls: 'letterSpacing',

    // Positioning
    pos: 'position',
    t: 'top',
    b: 'bottom',
    l: 'left',
    r: 'right',
    z: 'zIndex',
    op: 'opacity',

    // Shadow
    sh: 'shadowColor',
    soe: 'shadowOffset',
    sor: 'shadowRadius',
    sob: 'shadowOpacity',
  } as const,

  // Change the default props for any styled() component with a name.
  // We are discouraging the use of this and have deprecated it, prefer to use
  // styled() on any component to change it's styles.
  defaultProps: {},
});

type AppConfigType = typeof config;

// this will give you types for your components
// note - if using your own design system, put the package name here instead of tamagui
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfigType {}

  // if you want types for group styling props, define them like so:
  interface TypeOverride {
    groupNames(): 'a' | 'b' | 'c';
  }
}

export default config;
