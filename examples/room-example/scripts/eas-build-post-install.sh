#!/bin/bash

pwd

echo $ENV_CONFIG | base64 --decode >src/env.ts

echo "current platform: $PLATFORM, $EAS_BUILD_PLATFORM"

# https://docs.expo.dev/build-reference/variables/
if [ "$EAS_BUILD_PLATFORM" = "ios" ]; then
  echo "ios platform op"
elif [ "$EAS_BUILD_PLATFORM" = "android" ]; then
  echo "android platform op"
fi
