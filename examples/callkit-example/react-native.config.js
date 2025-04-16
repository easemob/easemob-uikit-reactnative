const { callkit_dir, callkit_package } = require('./scripts/utils');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [callkit_package.name]: {
      root: callkit_dir,
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
