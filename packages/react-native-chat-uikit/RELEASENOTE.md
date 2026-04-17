# Release Note

## 2.5.5

- Fixed Android conversation input keyboard avoidance across API levels and `edgeToEdgeEnabled` modes.
- Fixed Add pin message function for person chat.

## 2.5.4

- Upgraded React Native to 0.83.2 (from 0.76.x) and React to 19.2.0 (from 18.3.1).
- Fixed TypeScript type compatibility issues caused by React Native API changes: replaced `DefaultSectionT` with `Record<string, any>`, and replaced `ViewabilityConfig` / `ViewToken` with `any`.
- iOS: Simplified podspec to support New Architecture only via `install_modules_dependencies`.
- Switched `getChatService` to lazy-loading via the `chatFactory` module to avoid circular dependency issues.
- Exported sample code from the package entry point (`index.tsx`).
- Updated minimum peer dependency requirements: React ≥ 18.2.0, React Native ≥ 0.76.0.

## 2.5.2

- Fixed the callback issue in the image preview component
- Optimized GIF image display and loading in the example project

## 2.5.1

- Fixed the issue where clicking the expand button in the input bar component fails to switch between keyboard and extension bar.
- Fixed layout issues in the quoted message component.
- Fixed compilation and runtime issues with aosl dynamic library.

## 2.5.0

- Fixed the issue with abnormal status display on the login page.
- Optimized the issue where the welcome page loading animation doesn't close when switching pages.
- Optimized UIKit: Improved performance of simple icon animation components, significantly reducing CPU usage.
- Added support for custom data layer, allowing flexible business handling. For example: the app's phone number friend search feature uses this interface.
- Optimized image message preview in the app: Added support for custom image preview components.
- Optimized video message preview in the app: Added support for custom video preview components.
- Optimized Animation: Add voice image animation component.

## 2.4.8

- Fixed the issue where modal windows fail to display properly, including problems with modal pop-up menus and bottom pop-up menus.
- Added support for message roaming, along with a global switch to enable or disable the message roaming feature.

## 2.4.7

- Move the conversation detail background image from the message list to the message list parent component.
- Fix the UI for saving and loading local tip messages.

# 2.4.6

- Optimized variable naming in the example project for better readability
- Updated the login method for the UIKit product project to use Alibaba Cloud verification code login
- Fixed integration issues with React Native versions 0.77, 0.78, 0.79, and 0.80

## 2.4.5

- Fixed an issue where the example project incorrectly configured the specified server settings during login in development mode.

## 2.4.4

- Upgraded react-native version to 0.76

## 2.4.1

Bug Fixes:

- Page layout issues. See related content in `GestureHandlerRootView`.

## 2.4.0

New Features

- Added new message context menu style, with options for the original and new styles.
- Added new message attachment menu style, with options for the original and new styles.

Improvements

- Updated example project to support dev mode. In dev mode, overseas accounts can log in with id and token, while domestic accounts can log in with id and password.
- In dev mode, switch by continuously clicking the demo version number.
- Support for eas cloud build.

## 2.3.0

New Features

- Added URL preview functionality.
- Added group message pinning functionality.
- File preview component moved to the example project, with added support for opening common file types.

Improvements

- Optimized message list for smooth scrolling even with tens of thousands of messages.
- Improved basic components to enhance the usability of business components.

## 2.2.0

New Features

- Added text message input status. In single chat, when user A is typing, user B receives a notification that user A is typing.
- Added user subscription status.
- Added functionality to save image and video files.
- Added blacklist functionality.
- Added functionality to set background images for the chat page.

## 2.1.0

New Features

- Added message emoji reply functionality.
- Added message topic functionality.
- Added search historical messages functionality.
- Added new message notification functionality on the chat page.
- Added contact remark functionality.
- Added message translation functionality.

Improvements

- Added status avatar component.
- Added return business component.
- Added emoji component.
- Updated menu component.
- Updated tabbar component.
- Updated contact component.
- Updated chat component with historical message mode and topic mode.
- Updated message input component.
- Updated message list component.
- Updated conversation list component.
- Updated group list component.
- Updated group member list component.
- Updated contact details and group details components.
- Updated friend notification component.
- Updated chat service component.
- Updated configuration component.
- Updated event notification component.
- Updated internationalization content.
- Updated media service.
- Updated theme.
- Updated UI basic components: including but not limited to alert component, button component, list component, image component, click component, tab component, text component, text input component, prompt component.
- Updated project configuration to reduce dependencies.

## 2.0.0

Compared to version `1.0.0`, almost all components have been rewritten. Including but not limited to theme, internationalization, notifications, UI basic components, and UI business components.

## 1.0.0

A brand new `uikit` component library. Added UI pages on top of `chat` for easier integration of `chat` functionality.
