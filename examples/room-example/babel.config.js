const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const { room_package, room_dir } = require('./scripts/utils');

// react-native-builder-bob/babel-config 的 getConfig 在当前  monorepo 中会报错，所以，使用手动配置
let config = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          [room_package.name]: path.join(room_dir, 'src/index.tsx'),
        },
      },
    ],
  ],
};

module.exports = config;
