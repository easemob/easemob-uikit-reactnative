[Return to Parent Document](./index.en.md)

# Packaging Introduction

The `uikit` designed for terminal use will be provided as an `npm` package. For the custom content modifications of repository or urgent issue fixes, local packaging tests may be required.

The following uses the packaging of `uikit` as an example:

1. Modify the version number of `uikit`.

In the `package.json` file, update the value of the `version` field.

2. Generate the `npm` package using the terminal command `npm pack`.

3. In the target project, modify the dependency path.

## Common Issues

1. Use the `yarn link` command to add local dependencies.

This command may not work effectively for `react-native` projects with native modules in the dependency. It is recommended to use the method mentioned above for local dependencies.

2. Direct dependency via `repo`.

As `uikit` is in a multi-package repository, this method cannot be used.
