const { uikit_dir, uikit_package } = require('./scripts/utils');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [uikit_package.name]: {
      root: uikit_dir,
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
