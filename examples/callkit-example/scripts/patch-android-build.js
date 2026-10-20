#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { current_dir, color_log } = require('./utils');

// --- Patch android/app/build.gradle ---
//
// This script fixes Android build issues caused by dependency conflicts:
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

const androidAppDir = path.join(current_dir, 'android', 'app');
const buildGradlePath = path.join(androidAppDir, 'build.gradle');

color_log.info('[patch-android-build] Patching android/app/build.gradle...');

if (!fs.existsSync(buildGradlePath)) {
  color_log.warning(`  build.gradle not found: ${buildGradlePath}, skipping.`);
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf-8');
let changed = false;

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
  color_log.success('  build.gradle saved.');
} else {
  color_log.info('  build.gradle already up to date.');
}
