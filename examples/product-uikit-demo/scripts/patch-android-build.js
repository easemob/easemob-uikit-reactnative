#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { current_dir, color_log } = require('./utils');

// --- Patch android build files ---
//
// This script fixes Android build issues caused by dependency conflicts:
//
// 1. Duplicate androidsvg classes:
//    @d11/react-native-fast-image depends on both com.caverock:androidsvg (jar)
//    and com.caverock:androidsvg-aar (aar) via Glide, causing duplicate classes.
//    Fix: exclude the jar variant globally.
//
// 2. Duplicate libaosl.so native library (safety net):
//    hyphenate-chat (Chat SDK) and aosl (from Agora RTC via react-native-agora)
//    both bundle libaosl.so, causing merge conflicts.
//    Fix: use packagingOptions.pickFirst as a fallback safety net.
//
// 3. Intelligent aosl conflict resolution:
//    Generate aosl-fix.gradle that detects remote aosl dependencies,
//    compares versions when possible, and removes the unwanted copy.
//    This is the Android equivalent of the iOS aosl.xcframework dedup
//    handled by patch-ios-build.js / fix_aosl_conflicting.rb.
//
// 4. Duplicate GeneratedAppGlideModuleImpl in release builds:
//    @d11/react-native-fast-image's FastImageGlideModule.java triggers Glide's
//    annotation processor to generate GeneratedAppGlideModuleImpl. In release
//    builds, this generated class ends up in both the library's pre-dexed output
//    and the app's merged external dex, causing a duplicate class error.
//    Fix: set ext.excludeAppGlideModule = true in root build.gradle so that
//    fast-image skips compiling FastImageGlideModule.java entirely.

const androidAppDir = path.join(current_dir, 'android', 'app');
const buildGradlePath = path.join(androidAppDir, 'build.gradle');

color_log.info('[patch-android-build] Patching android/app/build.gradle...');

if (!fs.existsSync(buildGradlePath)) {
  color_log.warning(`  build.gradle not found: ${buildGradlePath}, skipping.`);
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf-8');
let changed = false;

// --- Fix 1: Exclude duplicate androidsvg jar ---
if (content.includes('exclude group: "com.caverock", module: "androidsvg"')) {
  color_log.warning('  androidsvg exclusion already present.');
} else {
  const marker = 'dependencies {';
  const markerIndex = content.lastIndexOf(marker);

  if (markerIndex === -1) {
    color_log.error('  Could not find "dependencies {" block in build.gradle.');
    process.exit(1);
  }

  const exclusionBlock = `// Exclude duplicate androidsvg jar; keep androidsvg-aar from Glide.
// See: docs/dev/android-build-patches.md
configurations.all {
    exclude group: "com.caverock", module: "androidsvg"
}

`;

  content =
    content.slice(0, markerIndex) + exclusionBlock + content.slice(markerIndex);
  color_log.success('  Added androidsvg exclusion.');
  changed = true;
}

// --- Fix 2: pickFirst for libaosl.so (safety net) ---
if (content.includes("pickFirst 'lib/**/libaosl.so'")) {
  color_log.warning('  libaosl.so pickFirst already present.');
} else {
  // Find the packagingOptions { jniLibs { ... } } block and add pickFirst
  const jniLibsMatch = content.match(
    /(packagingOptions\s*\{[\s\S]*?jniLibs\s*\{[^}]*)(})/
  );

  if (jniLibsMatch) {
    const insertPoint = jniLibsMatch.index + jniLibsMatch[1].length;
    const pickFirstLine = `\n            // Safety net: resolve duplicate libaosl.so if aosl-fix.gradle fails.\n            // See: docs/dev/android-build-patches.md\n            pickFirst 'lib/**/libaosl.so'\n        `;
    content =
      content.slice(0, insertPoint) +
      pickFirstLine +
      content.slice(insertPoint);
    color_log.success('  Added libaosl.so pickFirst (safety net).');
    changed = true;
  } else {
    color_log.error(
      '  Could not find packagingOptions.jniLibs block in build.gradle.'
    );
    process.exit(1);
  }
}

// --- Fix 3: Generate aosl-fix.gradle and inject apply from ---
const aoslFixGradlePath = path.join(androidAppDir, 'aosl-fix.gradle');

color_log.info('[patch-android-build] Generating aosl-fix.gradle...');

fs.copyFileSync(path.join(__dirname, 'aosl-fix.gradle'), aoslFixGradlePath);
color_log.success(`  Generated: ${aoslFixGradlePath}`);

// Inject apply from into build.gradle
if (content.includes("apply from: file('aosl-fix.gradle')")) {
  color_log.warning('  aosl-fix.gradle apply already present.');
} else {
  const applyBlock = `
// Intelligent aosl conflict resolution: detect remote dependencies,
// compare versions when possible, remove the unwanted copy.
// See: docs/dev/android-build-patches.md
ext.aosl_prefer = "easemob"
apply from: file('aosl-fix.gradle')
`;
  content += applyBlock;
  color_log.success('  Injected apply from aosl-fix.gradle.');
  changed = true;
}

if (changed) {
  fs.writeFileSync(buildGradlePath, content, 'utf-8');
  color_log.success('  android/app/build.gradle saved.');
} else {
  color_log.info('  android/app/build.gradle already up to date.');
}

// --- Fix 4: Exclude FastImageGlideModule to prevent duplicate GeneratedAppGlideModuleImpl ---
//
// @d11/react-native-fast-image's build.gradle checks:
//   if (safeExtGet('excludeAppGlideModule', false)) { exclude "**/FastImageGlideModule.java" }
// safeExtGet reads from rootProject.ext, so we set the flag in android/build.gradle (root project).

const rootBuildGradlePath = path.join(current_dir, 'android', 'build.gradle');

color_log.info(
  '[patch-android-build] Patching android/build.gradle (excludeAppGlideModule)...'
);

if (!fs.existsSync(rootBuildGradlePath)) {
  color_log.warning(
    `  Root build.gradle not found: ${rootBuildGradlePath}, skipping.`
  );
  process.exit(0);
}

let rootContent = fs.readFileSync(rootBuildGradlePath, 'utf-8');

if (rootContent.includes('excludeAppGlideModule')) {
  color_log.warning(
    '  excludeAppGlideModule already present in root build.gradle.'
  );
} else {
  const extMarker = rootContent.match(/ext\s*\{/);
  if (extMarker) {
    const insertIdx = extMarker.index + extMarker[0].length;
    const property = `\n        // Prevent @d11/react-native-fast-image from compiling FastImageGlideModule.java,\n        // which causes duplicate GeneratedAppGlideModuleImpl in release builds.\n        // See: docs/dev/android-build-patches.md\n        excludeAppGlideModule = true`;
    rootContent =
      rootContent.slice(0, insertIdx) + property + rootContent.slice(insertIdx);
  } else {
    const allprojectsMatch = rootContent.match(/allprojects\s*\{/);
    if (allprojectsMatch) {
      const property = `ext {\n    // Prevent @d11/react-native-fast-image from compiling FastImageGlideModule.java,\n    // which causes duplicate GeneratedAppGlideModuleImpl in release builds.\n    // See: docs/dev/android-build-patches.md\n    excludeAppGlideModule = true\n}\n\n`;
      rootContent =
        rootContent.slice(0, allprojectsMatch.index) +
        property +
        rootContent.slice(allprojectsMatch.index);
    } else {
      rootContent += `\next {\n    // Prevent @d11/react-native-fast-image from compiling FastImageGlideModule.java,\n    // which causes duplicate GeneratedAppGlideModuleImpl in release builds.\n    // See: docs/dev/android-build-patches.md\n    excludeAppGlideModule = true\n}\n`;
    }
  }

  fs.writeFileSync(rootBuildGradlePath, rootContent, 'utf-8');
  color_log.success(
    '  Added excludeAppGlideModule = true to android/build.gradle.'
  );
}
