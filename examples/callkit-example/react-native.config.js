const path = require('path');

module.exports = {
  project: {
    ios: { automaticPodsInstallation: true },
  },
  dependencies: {
    'react-native-chat-callkit': {
      root: path.join(__dirname, '../../packages/react-native-chat-callkit'),
      platforms: { ios: {}, android: {} },
    },
  },
};
