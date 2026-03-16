# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Yarn 4 monorepo containing three React Native SDK packages and five example applications for a chat SDK platform (Easemob/Agora):

- **packages/react-native-chat-uikit** — Full chat UI kit (conversations, messages, contacts, groups)
- **packages/react-native-chat-callkit** — Audio/video calling with Agora
- **packages/react-native-chat-room** — Live chatroom (gifts, emoji, participants)
- **examples/uikit-example**, **callkit-example**, **room-example** — Basic examples per SDK
- **examples/product-uikit-demo**, **product-room-demo** — Comprehensive demos combining SDKs

## Core Toolchain

| Tool | Version |
|------|---------|
| Node.js | >=20.19 (`.nvmrc` pins v22) |
| Yarn | 4.11.0 (`packageManager` field) |
| TypeScript | ~5.9.2 |
| React Native | 0.83.2 |
| Expo SDK | 55 |

**iOS:** Requires Xcode 26+ (Swift 6.2). Xcode 16.x cannot compile Expo SDK 55.
**Android:** JDK 17, Gradle 9.0.0, AGP 8.12.0, minSdk 24, compileSdk/targetSdk 36. New Architecture is enforced (`newArchEnabled=true`).

## Common Commands

```sh
# Install dependencies
yarn

# Build all packages (run after fresh checkout or dependency changes)
yarn prepare

# Type-check all packages and examples
yarn typecheck

# Lint all packages and examples
yarn lintcheck

# Format all files
yarn format

# Check formatting without writing
yarn formatcheck

# Detect circular dependencies
yarn circular-dep-check

# Remove build artifacts
yarn clean

# Remove all node_modules (nuclear clean)
yarn clean:node_modules
```

### Working on a specific package

```sh
yarn uikit <script>      # react-native-chat-uikit
yarn callkit <script>    # react-native-chat-callkit
yarn room <script>       # react-native-chat-room
```

### Running examples

```sh
yarn uikit-example start|ios|android
yarn callkit-example start|ios|android
yarn room-example start|ios|android
yarn product-uikit-demo start
yarn product-room-demo start
```

### Publishing a package

```sh
yarn uikit release       # or callkit/room
```

## Architecture

### Package build system

Each package uses **react-native-builder-bob** to compile TypeScript source from `src/` to `lib/` with two targets:
- `lib/module/` — ESM output
- `lib/typescript/` — TypeScript declarations

The `prepare` script runs codegen (`gen:config`, `gen:rename`, `gen:version`) then builds with `bob build`. Always run `yarn prepare` after pulling changes that touch a package's `src/`.

### Source structure (per package)

All three packages follow a consistent layered structure:

- `src/ui/` — Low-level primitive components (Button, Text, Modal, Toast, etc.)
- `src/biz/` — Business/feature components composed from `ui/` (ConversationList, MessageList, ContactList, etc.)
- `src/container/` — Root provider components that wrap the SDK context
- `src/chat/` — Chat SDK integration layer wrapping `react-native-chat-sdk`
- `src/theme/` — Theme provider and token definitions
- `src/i18n/` — Internationalization (uikit and room support multiple languages)
- `src/hook/` — Shared custom hooks
- `src/dispatch/` — Redux-like event dispatch system
- `src/config/` — Runtime configuration
- `src/services/` — Service layer (notifications, media, etc.)
- `src/__samples__/` — Minimal usage samples (exported from the package)

### Key architectural patterns

- **Provider pattern**: Each package exports a root `Container` component that must wrap the app. It initializes the chat SDK, theme, i18n, and dispatch system.
- **Dispatch system**: A lightweight pub/sub event bus (not Redux) used to decouple UI components from SDK events.
- **Theme tokens**: Components consume theme values via context, not hardcoded styles. Theming is customizable by passing a theme object to the container.
- **Peer dependencies**: All native dependencies (`react-native-gesture-handler`, `react-native-audio-recorder-player`, etc.) are peer deps — the consuming app must install them.

### Shared configuration files (root level)

- `tsconfig.packages.json` — Base TS config for packages (bundler resolution, strict, ESNext)
- `tsconfig.examples.json` — Base TS config for examples (extends expo/tsconfig.base)
- `eslint.config.packages.mjs` — ESLint flat config for packages
- `babel.config.packages.js` — Babel config for packages (react-native-builder-bob preset)
- `babel.config.examples.js` — Babel config for examples (babel-preset-expo)
- `.prettierrc.json` — Prettier: single quotes, 2-space indent, trailing commas ES5
- `lefthook.yml` — Git hooks: lint + typecheck + gitleaks + circular-dep-check on pre-commit

## Commit Convention

Conventional commits are enforced by commitlint. Allowed types:
`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `tag`, `example`

Pre-commit hooks run in parallel: ESLint, TypeScript, gitleaks secret scan, circular dependency check.

## Patches

The `patches/` directory contains yarn patches (e.g., `react-native-audio-recorder-player`). These are applied automatically by Yarn. If a patch fails after updating a dependency, regenerate it with `yarn patch`.
