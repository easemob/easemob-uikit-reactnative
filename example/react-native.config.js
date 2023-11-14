const utils = require('./scripts/utils.config');

const dependencies = {};
utils.kvs2.forEach((element) => {
  Object.defineProperties(
    dependencies,
    Object.getOwnPropertyDescriptors(element)
  );
});

module.exports = {
  dependencies: {
    ...dependencies,
    ...require('expo-dev-client/dependencies'),
  },
};
