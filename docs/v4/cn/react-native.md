# 版本介绍

react native 各个版本的现状。

|     | 版本号  | 介绍                     | 关闭 新架构 | 开启 新架构                                                                                                                                 | 备注                                  |
| --- | ------- | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 0   | 0.68    | 不支持新架构             |             | 无法开启                                                                                                                                    |                                       |
| 1   | 0.69    | 支持，但不稳定，默认关闭 |             | 最好别用                                                                                                                                    |                                       |
| 2   | 0.7     | 支持，但不稳定，默认关闭 |             | 最好别用                                                                                                                                    |                                       |
| 3   | 0.71    | 支持，但不稳定，默认关闭 |             | 最好别用                                                                                                                                    |                                       |
| 4   | 0.72    | 比较稳定，默认关闭       |             | `npx react-native codegen --help` 不支持                                                                                                    | 生成的代码和076版本的不兼容（已验证） |
| 5   |         |                          |             | 不推荐                                                                                                                                      | 需要 android studio 2022.1.1          |
| 6   | 0.73    | 比较稳定，默认关闭       |             | `npx react-native codegen --help` 不支持                                                                                                    |                                       |
| 7   |         |                          |             | 不推荐                                                                                                                                      |                                       |
| 8   | 0.74    | 稳定，默认关闭           |             | `npx react-native codegen --help` 开始支持                                                                                                  |                                       |
| 9   |         |                          |             | 开启新架构需要运行 `yarn react-native codegen --platform all`                                                                               |                                       |
| 10  | 0.75    | 稳定，默认关闭           |             |                                                                                                                                             |                                       |
| 11  | 0.76    | 默认开启                 |             | yarn react-native codegen --path '/Users/asterisk/tmp2025/2025-03-18/tmp/rn_demo_076/node_modules/react-native-chat-uikit' --platform all   | 最低要求 android studio 2024.2.1      |
| 12  | 0.77    | 默认开启                 |             |                                                                                                                                             |                                       |
| 13  | 0.78    | 默认开启                 |             | yarn react-native codegen --path '/Users/asterisk/tmp2025/2025-03-18/tmp/rn_demo_078/node_modules/react-native-chat-uikit' --source library | 最低要求 android studio 2024.3.1      |
| 14  | expo 52 | 默认关闭                 |             |                                                                                                                                             | 对应 rn0.76版本                       |
