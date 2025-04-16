[Return to Parent Document](./index.en.md)

- [Usage and Debugging of Local npm Packages](#usage-and-debugging-of-local-npm-packages)
  - [Method 1: Using link](#method-1-using-link)
    - [1. Prepare the local npm package](#1-prepare-the-local-npm-package)
    - [2. Modify the `package.json` configuration](#2-modify-the-packagejson-configuration)
    - [3. Modify the `metro.config.js` configuration](#3-modify-the-metroconfigjs-configuration)
    - [4. Restart the `yarn run start` service to apply the changes](#4-restart-the-yarn-run-start-service-to-apply-the-changes)
  - [Method 2: Directly use local files](#method-2-directly-use-local-files)

# Usage and Debugging of Local npm Packages

If you want to rely on local packages, there are two possible methods.

## Method 1: Using link

### 1. Prepare the local npm package

There are many ways to obtain it, using the `npm pack` command to package it is quite common.

### 2. Modify the `package.json` configuration

In the `package.json` file, modify the dependencies:

```json
{
  // ... other configurations
  "dependencies": {
    // ... other dependencies
    // "react-native-agora-chat": "1.3.0-beta.0", // Remote dependency method
    // "react-native-agora-chat": "/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0" // Local dependency method.
    "react-native-agora-chat": "link:../../react-native-agora-chat-1.3.0-beta.0" // Both relative and absolute paths are acceptable.
  }
}
```

### 3. Modify the `metro.config.js` configuration

In the `metro.config.js` file, add the following content:

```js
module.exports = {
  // ... other configurations
  watchFolders: [
    // ... other directories
    '/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0', // uikit npm local directory
  ],
  resolver: {
    // ... other configurations
    nodeModulesPaths: [
      // ... other directories
      '/Users/asterisk/Codes/rn/react-native-chat-library-2.0/node_modules', // Dependencies needed by uikit itself. The node_modules directory in the current repo root.
    ],
  },
};
```

### 4. Restart the `yarn run start` service to apply the changes

After modifying the `metro.config.js` file, you need to restart the service for the changes to take effect.

## Method 2: Directly use local files

This method is simple, you only need to modify the `package.json` configuration directly.

```json
{
  // ... other configurations
  "dependencies": {
    // ... other dependencies
    "react-native-agora-chat": "/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0" // Local dependency method.
  }
}
```
