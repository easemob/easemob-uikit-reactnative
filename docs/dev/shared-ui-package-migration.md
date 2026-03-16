# Shared UI Package Migration Plan

## Overview

This document outlines the complete migration plan for extracting shared UI components from `react-native-chat-uikit` and `react-native-chat-room` into a new independent package `react-native-chat-ui`.

**Migration Principle**: Use uikit as the source of truth. All components will be based on uikit's implementation. Room's incompatible code must be adapted to match the shared components.

**Migration Strategy**: Component-by-component migration with 100% validation at each step. No bulk migration.

---

## Package Definition

### Package Name
`react-native-chat-ui`

### Package Scope
- Pure UI primitive components only (Button, Text, Modal, Toast, etc.)
- No business logic
- No dependency on `react-native-chat-sdk`
- Theme system included (based on uikit's theme)

### Package Location
`packages/react-native-chat-ui/`

### Version Strategy
- Independent versioning starting at `1.0.0`
- Follows semver strictly
- uikit and room depend on it via `dependencies` field with semver range (e.g., `"^1.0.0"`)
- uikit (2.x) and room (1.x) maintain independent version numbers

---

## Component Inventory

### Shared Components (11 total)

Components that exist in both uikit and room:

1. **Alert** - uikit has more files (hooks, provider, types)
2. **Button** - uikit has BlockButton, CheckButton (room doesn't)
3. **FlatList** - implementation differs
4. **Image** - uikit has DynamicIcon (room doesn't)
5. **Keyboard** - ✅ IDENTICAL (easiest to migrate first)
6. **Modal** - implementation differs
7. **Switch** - uikit has CommonSwitch (room doesn't)
8. **TabPage** - uikit has TabPageBody.LIST (room doesn't)
9. **Text** - uikit has HighText, HighUrl, SingleLineText (room doesn't)
10. **TextInput** - implementation differs
11. **Toast** - uikit has more providers

### uikit-only Components (13 total)

Components that only exist in uikit (will be included in shared package):

- Animated
- ContextMenu
- hooks (ui-level hooks)
- ImagePreview
- Pressable
- Ripple
- SectionList
- ShadowView
- TriangleView
- VideoPreview
- View

---

## Dependencies Analysis

### Peer Dependencies

The shared package will have minimal peer dependencies:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.83.0",
    "react-native-gesture-handler": ">=2.0.0",
    "react-native-safe-area-context": ">=4.0.0"
  }
}
```

### Internal Dependencies

UI components in uikit currently depend on:

- `../theme` - ✅ Will be included in shared package
- `../assets` - Icon definitions (need to evaluate)
- `../error` - UIKitError (need to evaluate)
- `../types` - Type definitions (need to evaluate)
- `../hook` - Shared hooks (need to evaluate)
- `../i18n` - ❌ Should NOT be in shared package
- `../config` - ❌ Should NOT be in shared package
- `../utils` - Utility functions (need to evaluate)

**Decision Required**: Determine which internal dependencies should be included in the shared package vs. passed as props.

---

## Theme System

### Strategy
Use uikit's theme system as the foundation. Room's theme must be adapted to match.

### Theme Structure (from uikit)

```
src/theme/
├── generate.button.tsx
├── generate.color.tsx
├── generate.cr.tsx
├── generate.font.tsx
├── generate.gradient.tsx
├── generate.shadow.tsx
├── index.tsx
├── palette.preset.tsx
├── palette.tsx
├── theme.dark.tsx
├── theme.light.tsx
├── theme.tsx
└── types.tsx
```

### Key Differences (uikit vs room)

From `types.tsx` diff:

1. **CornerRadiusPaletteType**:
   - uikit: `small | medium | large | extraLarge`
   - room: `small | medium | large` (missing extraLarge)

2. **ThemeType**:
   - uikit has `cornerRadius` object with avatar/alert/input/bubble presets
   - room doesn't have this structure

3. **ThemeType**:
   - uikit has `releaseArea` field
   - room doesn't have this field

**Action**: Room must adopt uikit's theme type definitions.

---

## Package Structure

```
packages/react-native-chat-ui/
├── src/
│   ├── ui/                    # All UI components
│   │   ├── Alert/
│   │   ├── Button/
│   │   ├── FlatList/
│   │   ├── Image/
│   │   ├── Keyboard/
│   │   ├── Modal/
│   │   ├── Switch/
│   │   ├── TabPage/
│   │   ├── Text/
│   │   ├── TextInput/
│   │   ├── Toast/
│   │   ├── Animated/
│   │   ├── ContextMenu/
│   │   ├── hooks/
│   │   ├── ImagePreview/
│   │   ├── Pressable/
│   │   ├── Ripple/
│   │   ├── SectionList/
│   │   ├── ShadowView/
│   │   ├── TriangleView/
│   │   ├── VideoPreview/
│   │   └── View/
│   ├── theme/                 # Theme system
│   ├── assets/                # Icons (if needed)
│   ├── types/                 # Type definitions
│   ├── error/                 # Error classes (if needed)
│   ├── hook/                  # Shared hooks
│   ├── utils/                 # Utility functions
│   └── index.tsx              # Main export
├── lib/                       # Build output (gitignored)
│   ├── module/                # ESM output
│   └── typescript/            # Type declarations
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── babel.config.js
├── .eslintrc.js
└── README.md
```

---

## Build Configuration

### package.json

```json
{
  "name": "react-native-chat-ui",
  "version": "1.0.0",
  "description": "Shared UI components for React Native chat SDKs",
  "main": "lib/module/index.js",
  "types": "lib/typescript/src/index.d.ts",
  "react-native": "src/index.tsx",
  "source": "src",
  "files": [
    "src",
    "lib",
    "!**/__tests__",
    "!**/__fixtures__",
    "!**/__mocks__"
  ],
  "scripts": {
    "typecheck": "tsc",
    "lintcheck": "eslint \"src/**/*.{js,ts,tsx}\"",
    "circular-dep-check": "madge --circular --extensions ts,tsx src",
    "clean": "del-cli lib",
    "prepare": "yarn lib",
    "lib": "bob build",
    "release": "release-it --only-version"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.83.0",
    "react-native-gesture-handler": ">=2.0.0",
    "react-native-safe-area-context": ">=4.0.0"
  },
  "devDependencies": {
    "@release-it/conventional-changelog": "^10.0.1",
    "react-native-builder-bob": "^0.40.18",
    "release-it": "^19.0.4",
    "typescript": "~5.9.2"
  },
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": [
      ["module", { "esm": true }],
      ["typescript", { "project": "tsconfig.build.json" }]
    ]
  }
}
```

### tsconfig.json

Extend from root `tsconfig.packages.json`:

```json
{
  "extends": "../../tsconfig.packages.json",
  "compilerOptions": {
    "outDir": "lib/typescript"
  },
  "include": ["src"],
  "exclude": ["node_modules", "lib", "**/__tests__"]
}
```

### babel.config.js

```js
module.exports = require('../../babel.config.packages.js');
```

### eslint.config.js

```js
module.exports = require('../../eslint.config.packages.mjs');
```

---

## Migration Phases

### Phase 0: Preparation (Week 1)

**Goal**: Set up package structure and build system

**Template Strategy**: Use `react-native-chat-uikit` as the template for creating the new package. This ensures consistency in build configuration, tooling, and project structure, reducing manual setup and potential configuration errors.

#### Steps

1. **Copy package structure from uikit**:
   ```bash
   # Create new package directory
   mkdir -p packages/react-native-chat-ui

   # Copy configuration files from uikit as template
   cp packages/react-native-chat-uikit/package.json packages/react-native-chat-ui/
   cp packages/react-native-chat-uikit/tsconfig.json packages/react-native-chat-ui/
   cp packages/react-native-chat-uikit/tsconfig.build.json packages/react-native-chat-ui/
   cp packages/react-native-chat-uikit/babel.config.js packages/react-native-chat-ui/
   cp packages/react-native-chat-uikit/.eslintrc.js packages/react-native-chat-ui/
   cp packages/react-native-chat-uikit/.gitignore packages/react-native-chat-ui/
   ```

2. **Modify `package.json`**:
   - Change `name` to `"react-native-chat-ui"`
   - Change `version` to `"1.0.0"`
   - Update `description` to `"Shared UI components for React Native chat SDKs"`
   - Remove business-specific dependencies (keep only UI-related ones)
   - Remove codegen scripts (`gen:config`, `gen:rename`, `gen:version`)
   - Simplify `prepare` script to just `"yarn lib"`
   - Keep the same `react-native-builder-bob` configuration
   - Keep the same `devDependencies` (builder-bob, release-it, typescript, etc.)

3. **Create minimal source structure**:
   ```bash
   mkdir -p packages/react-native-chat-ui/src
   touch packages/react-native-chat-ui/src/index.tsx
   ```

4. **Add basic exports to `src/index.tsx`**:
   ```ts
   // Placeholder - will be populated during migration
   export const version = '1.0.0';
   ```

5. **Verify workspace recognition**:
   - Root `package.json` already has `"workspaces": ["packages/*"]`
   - Run `yarn install` to link the new package

6. **Update root `yarn prepare` script** to build in topological order:
   ```json
   "prepare": "yarn workspaces foreach --topological run prepare"
   ```

7. **Verify build works**:
   ```bash
   yarn install
   yarn prepare
   ```

#### Why Use uikit as Template?

- **Proven configuration**: uikit's build setup is battle-tested and works with the monorepo
- **Consistency**: Same tooling versions, same builder-bob config, same TypeScript settings
- **Less error-prone**: Copy-paste reduces typos and configuration mismatches
- **Faster setup**: No need to manually configure builder-bob, release-it, etc.
- **Easier maintenance**: When tooling is updated in uikit, we know the same config works for shared package

**Validation**:
- [ ] `yarn install` succeeds
- [ ] `yarn prepare` builds the empty package
- [ ] `yarn typecheck` passes
- [ ] `yarn lintcheck` passes

---

### Phase 1: Theme System Migration (Week 1-2)

**Goal**: Migrate theme system first since all components depend on it

1. Copy entire `src/theme/` from uikit to shared package
2. Update internal imports (if any)
3. Export from `src/index.tsx`
4. Build and verify types are generated correctly
5. Update uikit to import theme from shared package:
   ```ts
   // Before
   import { useThemeContext } from '../theme';

   // After
   import { useThemeContext } from 'react-native-chat-ui';
   ```
6. Update room to import theme from shared package
7. Fix any type incompatibilities in room

**Validation**:
- [ ] Shared package builds successfully
- [ ] uikit builds successfully with new import
- [ ] room builds successfully with new import
- [ ] uikit-example runs without errors
- [ ] room-example runs without errors
- [ ] Theme switching works in both examples
- [ ] No visual regressions

---

### Phase 2: Component Migration (Week 2-6)

**Goal**: Migrate components one by one, starting with simplest

#### Migration Order (by complexity)

1. **Keyboard** (Week 2) - IDENTICAL, zero risk
2. **View** (Week 2) - uikit-only, simple wrapper
3. **Text** (Week 2-3) - Has variants, moderate complexity
4. **Image** (Week 3) - Has Icon, DefaultImage, etc.
5. **Button** (Week 3-4) - Multiple variants, widely used
6. **FlatList** (Week 4) - Custom list component
7. **SectionList** (Week 4) - uikit-only
8. **TextInput** (Week 4) - Input component
9. **Switch** (Week 4) - Toggle component
10. **Modal** (Week 5) - Complex with hooks and providers
11. **Alert** (Week 5) - Has provider and hooks
12. **Toast** (Week 5) - Has multiple providers
13. **TabPage** (Week 5-6) - Complex tab system
14. **Animated** (Week 6) - uikit-only
15. **Pressable** (Week 6) - uikit-only
16. **Ripple** (Week 6) - uikit-only
17. **ShadowView** (Week 6) - uikit-only
18. **TriangleView** (Week 6) - uikit-only
19. **ImagePreview** (Week 6) - uikit-only
20. **VideoPreview** (Week 6) - uikit-only
21. **ContextMenu** (Week 6) - uikit-only
22. **hooks** (Week 6) - UI-level hooks

#### Per-Component Migration Checklist

For each component:

1. **Copy** component from uikit to shared package
2. **Analyze dependencies**:
   - Identify all imports from `../theme`, `../assets`, `../types`, etc.
   - Decide: include in shared package or pass as props?
3. **Update imports** in the component
4. **Export** from shared package `src/index.tsx`
5. **Build** shared package: `yarn ui lib`
6. **Update uikit** to import from shared package
7. **Build uikit**: `yarn uikit lib`
8. **Test uikit-example**: `yarn uikit-example start`
   - Visual inspection
   - Interaction testing
   - Theme switching
9. **Update room** to import from shared package
10. **Fix incompatibilities** in room's usage code
11. **Build room**: `yarn room lib`
12. **Test room-example**: `yarn room-example start`
   - Visual inspection
   - Interaction testing
   - Theme switching
13. **Delete** old component from uikit and room
14. **Run full test suite**:
    - `yarn typecheck`
    - `yarn lintcheck`
    - `yarn circular-dep-check`
15. **Commit** with message: `refactor(ui): migrate [ComponentName] to shared package`

**Validation Criteria (100% required)**:
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No circular dependencies
- [ ] uikit-example runs without errors
- [ ] room-example runs without errors
- [ ] No visual regressions (screenshot comparison recommended)
- [ ] All interactions work (buttons, modals, inputs, etc.)
- [ ] Theme switching works
- [ ] No console warnings/errors

---

### Phase 3: Supporting Modules (Week 7)

**Goal**: Migrate supporting modules that UI components depend on

1. **assets** (if needed for icons)
2. **types** (shared type definitions)
3. **error** (UIKitError if needed)
4. **hook** (shared hooks used by UI components)
5. **utils** (utility functions used by UI components)

For each module:
- Evaluate if it should be in shared package
- If yes, follow same migration checklist as components
- If no, refactor components to accept values via props

**Validation**: Same as Phase 2

---

### Phase 4: Dependency Updates (Week 7)

**Goal**: Update uikit and room package.json to depend on shared package

1. Add to uikit's `package.json`:
   ```json
   "dependencies": {
     "react-native-chat-ui": "^1.0.0"
   }
   ```

2. Add to room's `package.json`:
   ```json
   "dependencies": {
     "react-native-chat-ui": "^1.0.0"
   }
   ```

3. Ensure peer dependencies are aligned across all three packages

4. Update root `yarn prepare` to use topological sort (already done in Phase 0)

**Validation**:
- [ ] `yarn install` resolves dependencies correctly
- [ ] `yarn prepare` builds in correct order (ui → uikit/room)
- [ ] All examples run successfully

---

### Phase 5: Documentation & Release (Week 8)

**Goal**: Document the shared package and prepare for release

1. Write comprehensive README.md for shared package:
   - Installation instructions
   - Usage examples
   - Component API documentation
   - Theme customization guide
   - Peer dependency requirements

2. Add CHANGELOG.md

3. Set up release-it configuration

4. Update root CLAUDE.md to document the new package

5. Update migration guide for external users (if applicable)

6. Publish `react-native-chat-ui@1.0.0` to npm

7. Update uikit and room to use published version

8. Publish new versions of uikit and room

**Validation**:
- [ ] README is clear and complete
- [ ] CHANGELOG follows conventional commits
- [ ] Package publishes successfully
- [ ] External installation works: `npm install react-native-chat-ui`
- [ ] All peer dependencies are documented

---

## Development Workflow

### Source Code Debugging

Metro configuration in examples already supports monorepo via `react-native-monorepo-config`. When you modify source code in `packages/react-native-chat-ui/src/`, changes will be picked up by Metro's watcher automatically.

**No additional Metro configuration needed** - the existing setup will work.

### Build Order

Always build in topological order:

```bash
# Build all packages
yarn prepare

# Build specific package
yarn ui lib          # react-native-chat-ui
yarn uikit lib       # react-native-chat-uikit
yarn room lib        # react-native-chat-room
```

### Testing Workflow

After each component migration:

```bash
# 1. Build shared package
yarn ui lib

# 2. Build dependent packages
yarn uikit lib
yarn room lib

# 3. Test examples
yarn uikit-example start
# In another terminal:
yarn uikit-example ios
# or
yarn uikit-example android

# 4. Repeat for room
yarn room-example start
yarn room-example ios
```

---

## Risk Mitigation

### Rollback Strategy

Each component migration is a separate commit. If issues are found:

1. Identify the problematic commit
2. Revert: `git revert <commit-hash>`
3. Fix the issue
4. Re-apply the migration

### Compatibility Issues

If room's usage is incompatible with uikit's component:

1. Document the incompatibility
2. Create an adapter layer in room if needed
3. Or refactor room's usage code to match uikit's API
4. Prefer refactoring over adapters (cleaner long-term)

### Breaking Changes

If a component migration requires breaking changes:

1. Document in CHANGELOG
2. Provide migration guide
3. Consider deprecation warnings before removal
4. Coordinate with team before proceeding

---

## Success Criteria

### Technical Metrics

- [ ] Zero TypeScript errors across all packages
- [ ] Zero ESLint errors across all packages
- [ ] Zero circular dependencies
- [ ] All examples build and run successfully
- [ ] Build time does not increase significantly
- [ ] Bundle size does not increase significantly

### Functional Metrics

- [ ] 100% visual parity with pre-migration state
- [ ] All interactions work identically
- [ ] Theme switching works in all examples
- [ ] No console warnings or errors
- [ ] Hot reload works in development

### Process Metrics

- [ ] Each component migration is a separate, reviewable commit
- [ ] All commits follow conventional commit format
- [ ] Documentation is complete and accurate
- [ ] Team can develop and debug as before

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 0: Preparation | Week 1 | Package structure and build system |
| Phase 1: Theme Migration | Week 1-2 | Theme system in shared package |
| Phase 2: Component Migration | Week 2-6 | All 22 components migrated |
| Phase 3: Supporting Modules | Week 7 | Assets, types, hooks, utils migrated |
| Phase 4: Dependency Updates | Week 7 | Package dependencies finalized |
| Phase 5: Documentation & Release | Week 8 | Published to npm |

**Total Duration**: 8 weeks

---

## Open Questions

1. **Assets**: Should icon assets be in shared package or passed as props?
2. **Error handling**: Should UIKitError be in shared package?
3. **i18n**: UI components currently use i18n - should they accept strings via props instead?
4. **Utils**: Which utility functions should be in shared package vs. duplicated?
5. **Versioning**: Should we use Lerna or Changesets for coordinated releases?

**Action**: Resolve these questions in Phase 0 before starting migration.

---

## Appendix

### Useful Commands

```bash
# Install dependencies
yarn

# Build all packages in topological order
yarn prepare

# Type-check all packages
yarn typecheck

# Lint all packages
yarn lintcheck

# Check circular dependencies
yarn circular-dep-check

# Clean build artifacts
yarn clean

# Work on specific package
yarn ui <script>
yarn uikit <script>
yarn room <script>

# Run examples
yarn uikit-example start|ios|android
yarn room-example start|ios|android
```

### References

- [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
