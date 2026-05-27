const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { getDefaultConfig: getDefaultMetroConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const { resolver } = getDefaultMetroConfig.getDefaultValues();

/** @type {import('metro-config').MetroConfig} */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: [...resolver.assetExts, 'txt', resolver.assetExts.filter(ext => ext !== 'svg')],
    sourceExts: [...resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
