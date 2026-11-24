_English | [中文](./README.zh.md)_

---

# Download Code

Method 1:

    Download the code from the repository: `https://github.com/easemob/easemob-uikit-reactnative`

Method 2:

    Download the zip file from `https://github.com/easemob/easemob-uikit-reactnative`.

# Project Initialization

Make sure the environment is configured properly. If not, please [refer to this guide](../../docs/v4/en/env.md)

Go to the root directory and execute:

```sh
yarn && yarn prepare
```

# Required Information

Go to the `examples/uikit-example` directory.
Find the `env.ts` file and fill in the `appKey` and other required information.

# Running the Project

Go to the `examples/uikit-example` directory and execute:

```sh
yarn run android
# or
yarn run ios
```

## iOS Integration Modes

**SPM mode (default)**: this project defaults to `use_frameworks! :linkage => :dynamic` — the root `yarn prepare` (via `yarn patch:ios`) sets `ios.useFrameworks` in `ios/Podfile.properties.json`, so every `pod install` produces a dynamic integration. Just run:

```sh
yarn run ios
```

**Classic static mode (manual opt-in)**:

1. Remove the `"ios.useFrameworks": "dynamic"` entry from `ios/Podfile.properties.json`.
2. Clean and re-install pods:

   ```sh
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   ```

3. Run `yarn run ios`.

To switch back to SPM mode, re-run `yarn patch:ios` to restore the entry, then repeat step 2.
