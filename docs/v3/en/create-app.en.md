[Return to Parent Document](./index.en.md)

# Creating a Project

```sh
# Official Creation Method
npx react-native@latest init AwesomeProject

# Expo Creation Method
# This method is recommended by the official React Native website
npx create-expo-app AwesomeProject

# Expo Creation Method 2
# This method allows you to choose different types of templates. You can find related content on the Expo website and GitHub.
npx create-react-native-app
```

**Methods for Creating Libraries**

```sh
# Method 1
npx create-react-native-library@latest awesome-library

# Method 2
npx create-expo-module@latest --local
pod install --project-directory=ios
```

## FAQ

1. How to create a project with a specific version?

   1. `npx react-native@latest init --version 0.73.2 AwesomeProject`

2. How to create an expo project with a specific `react-native` version?

   1. You cannot specify the version directly.

3. How to create a library project with a specific version?

   1. You cannot specify the `react-native` version directly.

4. How to Use UIKit in the Expo Framework
   1. For newly created Expo projects without `ios` and `android` folders, you need to use the command `npx expo prebuild --clean` to add them according to the instructions. If it's an older project, please refer to the Expo website for relevant migration instructions.
