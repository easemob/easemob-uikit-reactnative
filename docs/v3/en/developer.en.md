[Return to Parent Document](./index.en.md)

# Project Contributors

[Download Link](https://github.com/AsteriskZuo/react-native-chat-library)

## Branch Introduction

- Stable branch main, long-term maintenance
- Development branch dev, long-term maintenance
- Feature branch dev-xx

## Code Submission Notes

1. For fixing issues, submit a PR
2. For developing new features, create a new branch
3. Ensure the code compiles and runs correctly, no syntax errors, consistent formatting
4. Do not upload sensitive information
5. Follow commit conventions commitlint

_Please follow the code submission rules. For details, refer to: `@commitlint/config-conventional/README.md`_

## Create Tag

```sh
git commit -m"tag: uikit@1.0.0 && callkit@1.0.0"
git tag -a uikit@1.0.0 -m"uikit@1.0.0"
git tag -a callkit@1.0.0 -m"callkit@1.0.0"
git tag -a room@1.0.0 -m"room@1.0.0"
git push --tags