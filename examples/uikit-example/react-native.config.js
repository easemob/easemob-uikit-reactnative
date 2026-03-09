const path = require('path');

module.exports = {
  project: {
    ios: { automaticPodsInstallation: true },
  },
  dependencies: {
    'react-native-chat-uikit': {
      root: path.join(__dirname, '../../packages/react-native-chat-uikit'),
      platforms: { ios: {}, android: {} },
    },
  },
};
