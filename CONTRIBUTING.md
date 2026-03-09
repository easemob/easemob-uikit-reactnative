# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

Then initialize all packages (build outputs, codegen, etc.):

```sh
yarn prepare
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
yarn release
```

### Scripts

The root `package.json` file contains various scripts for common tasks:

- `yarn prepare`: build all packages and run codegen across the monorepo.
- `yarn typecheck`: type-check all packages and examples with TypeScript.
- `yarn lintcheck`: lint all packages and examples with ESLint.
- `yarn format`: format all files with Prettier.
- `yarn formatcheck`: check formatting without writing changes.
- `yarn circular-dep-check`: detect circular dependencies across all packages.
- `yarn clean`: remove build artifacts from all packages and examples.

Workspace shortcuts let you run scripts in a specific package or example directly, e.g.:

- `yarn uikit <script>`: run a script in `react-native-chat-uikit`.
- `yarn callkit <script>`: run a script in `react-native-chat-callkit`.
- `yarn room <script>`: run a script in `react-native-chat-room`.
- `yarn uikit-example start`: start the Metro / Expo dev server for `uikit-example`.
- `yarn uikit-example android`: run `uikit-example` on Android.
- `yarn uikit-example ios`: run `uikit-example` on iOS.
- `yarn product-uikit-demo start`: start the dev server for `product-uikit-demo`.
- `yarn room-example start`: start the dev server for `room-example`.
- `yarn callkit-example start`: start the dev server for `callkit-example`.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
