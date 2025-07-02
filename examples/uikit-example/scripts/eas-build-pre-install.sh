#!/bin/bash

# 设置 Yarn 路径
export PATH="$PWD/../../.yarn/releases:$PATH"

cd ../..
yarn install
yarn prepare
cd examples/uikit-example
