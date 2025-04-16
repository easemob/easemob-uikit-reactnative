const { room_dir, room_package } = require('./scripts/utils');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [room_package.name]: {
      root: room_dir,
      platforms: {
        // Codegen script incorrectly fails without this
        // So we explicitly specify the platforms with empty object
        ios: {},
        android: {},
      },
    },
    ...require('expo-dev-client/dependencies'),
  },
};
