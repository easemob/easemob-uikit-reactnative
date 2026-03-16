# Repository Guidelines

## Project Structure & Module Organization
This is a Yarn workspaces monorepo.
- `packages/`: publishable SDK modules (`react-native-chat-uikit`, `react-native-chat-callkit`, `react-native-chat-room`).
- `examples/`: Expo demo apps (`uikit-example`, `callkit-example`, `room-example`, and product demos) used for manual validation.
- `docs/`: versioned documentation and developer notes.
- `scripts/` and `templates/`: shared generation/utilities.
- `patches/`: patch-package style dependency fixes.

Primary source code lives under each package’s `src/`. Build outputs are in `lib/` and should be treated as generated artifacts.

## Build, Test, and Development Commands
Run from repository root unless noted.
- `yarn prepare`: build all workspaces (`gen` + library build where configured).
- `yarn lintcheck`: run ESLint across all workspaces.
- `yarn typecheck`: run TypeScript checks across all workspaces.
- `yarn circular-dep-check`: detect circular imports with Madge.
- `yarn workspace react-native-chat-callkit lintcheck`: scope checks to one package.
- `yarn workspace uikit-example start`: run an example app with Expo dev client.

## Coding Style & Naming Conventions
- Formatting: Prettier (`.prettierrc.json`) with 2 spaces, single quotes, trailing commas (ES5), LF endings.
- Linting: ESLint flat config + `simple-import-sort` + `prettier` plugin.
- Keep TypeScript/React files in `src/`; use descriptive PascalCase for components (e.g., `BottomMenuButton.tsx`) and camelCase for utilities.
- Respect `.editorconfig` and avoid committing generated `lib/` diffs unless release/build changes require it.

## Testing Guidelines
There is no dedicated unit-test suite at root today; quality gates are:
- static checks (`lintcheck`, `typecheck`, `circular-dep-check`)
- runtime verification in relevant `examples/*` apps.

For behavior changes, add or update a focused example screen under `examples/*/src` and document manual verification steps in the PR.

## Commit & Pull Request Guidelines
- Conventional commit types are enforced via commitlint (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `tag:`, etc.).
- Pre-commit hooks run lint, type checks, circular dependency checks, and gitleaks.
- PRs should include a clear summary and impacted package(s).
- PRs should include a linked issue or task.
- PRs should include validation evidence (commands run and/or screenshots for UI changes).
- PRs should call out breaking changes or migration steps.
