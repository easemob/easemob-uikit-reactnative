[Return to Parent Document](./index.en.md)

# Integration Environment Requirements

## Architecture Requirement

This library is a pure Fabric (New Architecture) component. The host App **must enable New Architecture**.

## Basic Requirements

| Dependency | Minimum Version | Notes |
| --- | --- | --- |
| **React Native** | 0.76.0 | New Arch enabled by default; recommended minimum |
| **React** | 18.2.0 | |
| **Expo SDK** (optional) | 52 | Corresponds to RN 0.76; bare RN is also supported |
| **Node.js** | 18 | |
| **react-native-chat-sdk** | ^1.12.0 | Core IM SDK |

## iOS

| Tool / Property | Expo SDK 52 / RN 0.76 | Expo SDK 55 / RN 0.83 |
| --- | --- | --- |
| **Xcode** | 15.1+ | 26+ (Swift 6.2) |
| **macOS** | — | 15.6+ (required by Xcode 26) |
| **iOS Deployment Target** | 15.1 | 16.0 |

> **Note**: Expo SDK 55's `expo-modules-core` uses Swift 6.2 syntax and requires Xcode 26+. Bare RN projects (without Expo) are not affected — the Xcode version is determined by RN itself.

## Android

| Tool / Property | Expo SDK 52 / RN 0.76 | Expo SDK 55 / RN 0.83 |
| --- | --- | --- |
| **JDK** | 17 | 17 |
| **Gradle** | 8.10.2 | 9.0.0 |
| **AGP** | 8.6.0 | 8.12.0 |
| **Kotlin** | 1.9.24 | 2.1.20 |
| **compileSdkVersion** | 35 | 36 |
| **targetSdkVersion** | 34 | 36 |
| **minSdkVersion** | 24 (Android 7.0) | 24 (Android 7.0) |
| **NDK** | 26.1.10909125 | 27.1.12297006 |

## Expo SDK to React Native Version Mapping

| Expo SDK | React Native | Compatible |
| --- | --- | --- |
| **55** | 0.83 | ✅ Latest |
| **54** | 0.81 | ✅ |
| **53** | 0.79 | ✅ |
| **52** | 0.76 | ✅ Recommended minimum |
| 51 | 0.74 | ⚠️ Requires manual New Arch setup; untested |
| ≤49 | ≤0.72 | ❌ Not supported |
