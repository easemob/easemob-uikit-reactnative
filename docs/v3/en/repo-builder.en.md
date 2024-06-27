[Return to Parent Document](./index.en.md)

# Build a Repository

The multi-package repository is built in the same way as common projects, except that global configuration and multi-package management are required and the reuse of dependencies is optimized.

You can take the following steps to build the project:

On MacOS system, proceed as follows:

1. Download the repository
2. Run script to execute initialization
3. Configure files
4. Add necessary files (optional)

#### Download the Repository

Repository address: `https://github.com/easemob/easemob-uikit-reactnative/`

If you download it using a git command, you need to switch to the corresponding branch.

```sh
git clone --branch dev git@github.com:easemob/react-native-chat-library.git
```

#### Run Scripts and Commands

Run the command in the root directory of the repository.

```sh
# Initialize the project
yarn

# Generate configuration files env.ts / config.local.ts / version.ts
# After execution, these files will be added to the respective directories. If they are not added, please find the reason or add them manually.
yarn yarn-prepack
```

**Note**

`yarn-prepack` is a command set primarily used to generate necessary files including `env.ts`, `version.ts`, `config.local.ts`, and `rename.ts`. The `env.ts` file also requires the `appKey` parameter to be filled.

#### Add Necessary Files (Optional)

If the project is utilizing `react-native-firebase/messaging`, additional files need to be added. For `ios`, add the `GoogleService-Info.plist` file. For android, add the `google-services.json` file. For detailed information, refer to their respective documentation linked in the reference section.

## FAQs

1. Outdated MacOS system version
   Upgrade the system.

2. Outdated dependencies in the MacOS environment
   Update the software.
3. Compilation error, the `GoogleService-Info.plist` or `google-services.json` file cannot be found
   Add the necessary `FCM` files.
