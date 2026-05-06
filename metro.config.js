const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "wagmi/providers/public": path.resolve(__dirname, "stubs/wagmi/providers/public.js"),
};

module.exports = withNativeWind(config, { input: './global.css' });
