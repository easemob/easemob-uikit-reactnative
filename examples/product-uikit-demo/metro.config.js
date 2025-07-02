const path = require('node:path');
const escape = require('escape-string-regexp');

// const { getDefaultConfig } = require('@react-native/metro-config');
const { getDefaultConfig } = require('expo/metro-config');
// const { mergeConfig } = require('@react-native/metro-config');
// const { getConfig } = require('react-native-builder-bob/metro-config');

const {
  root_dir,
  callkit_dir,
  current_dir,
  uikit_dir,
} = require('./scripts/utils');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
let config = getDefaultConfig(__dirname);

// 添加 node_modules 路径
config.resolver.nodeModulesPaths = [
  path.join(current_dir, 'node_modules'),
  path.join(callkit_dir, 'node_modules'),
  path.join(uikit_dir, 'node_modules'),
];

// 来自 uikit-example 和 callkit-example 的 metro.config.js 的 extraNodeModules
const extraNodeModulesKeys = [
  '@react-native/assets-registry',
  '@react-native-community/blur',
  '@react-native-async-storage/async-storage',
  '@react-native-camera-roll/camera-roll',
  '@react-native-clipboard/clipboard',
  'react',
  'react-native',
  'react-native-agora',
  'react-native-audio-recorder-player',
  'react-native-chat-sdk',
  'react-native-create-thumbnail',
  'react-native-device-info',
  '@react-native-documents/picker',
  'react-native-file-access',
  'react-native-gesture-handler',
  'react-native-image-picker',
  'react-native-permissions',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-vector-icons',
  'react-native-video',
];

const extraNodeModules = {};
extraNodeModulesKeys.forEach((key) => {
  extraNodeModules[key] = path.join(current_dir, 'node_modules', key);
});
config.resolver.extraNodeModules = extraNodeModules;

// 添加 blockList
const blockList = [];
Object.keys(config.resolver.extraNodeModules).forEach((moduleName) => {
  blockList.push(
    new RegExp(
      `^${escape(path.join(callkit_dir, 'node_modules', moduleName))}\\/.*$`
    )
  );
  blockList.push(
    new RegExp(
      `^${escape(path.join(uikit_dir, 'node_modules', moduleName))}\\/.*$`
    )
  );
});
config.resolver.blockList = blockList;

config.projectRoot = current_dir;
config.watchFolders = [root_dir];

// 如果使用了 yarn@1.22.19, react、react-native 会在 父目录的 node_modules 中
// 当前目录下 没有 react、react-native 的依赖，所以，需要删除
// 另外，如果设置了 blacklistRE ，blockList 的设置会失效
delete config.resolver.blacklistRE;

module.exports = config;
