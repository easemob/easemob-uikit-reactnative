#!/bin/bash

pwd

echo $ANDROID_GOOGLE_SERVICES_JSON | base64 --decode >android/app/google-services.json
echo $IOS_GOOGLE_SERVICES_JSON | base64 --decode >ios/ChatUikitFullExample/GoogleService-Info.plist

echo $ENV_CONFIG | base64 --decode >src/env.ts

echo "current platform: $PLATFORM, $EAS_BUILD_PLATFORM"

# https://docs.expo.dev/build-reference/variables/
if [ "$EAS_BUILD_PLATFORM" = "ios" ]; then
  echo "ios platform op"
  # cd ios || exit
  # pod update HyphenateChat
  # pod install
elif [ "$EAS_BUILD_PLATFORM" = "android" ]; then
  echo "android platform op"
fi
