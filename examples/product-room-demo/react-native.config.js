const path = require('path');

module.exports = {
  project: {
    ios: { automaticPodsInstallation: true },
  },
  dependencies: {
    'react-native-chat-room': {
      root: path.join(__dirname, '../../packages/react-native-chat-room'),
      platforms: { ios: {}, android: {} },
    },
  },
};
