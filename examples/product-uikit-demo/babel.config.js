const path = require('path');
// const { getConfig } = require('react-native-builder-bob/babel-config');
const {
  callkit_package,
  callkit_dir,
  uikit_package,
  uikit_dir,
} = require('./scripts/utils');

// react-native-builder-bob/babel-config 的 getConfig 在当前  monorepo 中会报错，所以，使用手动配置
let config = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          [callkit_package.name]: path.join(callkit_dir, 'src/index.tsx'),
          [uikit_package.name]: path.join(uikit_dir, 'src/index.tsx'),
        },
      },
    ],
  ],
};

module.exports = config;
