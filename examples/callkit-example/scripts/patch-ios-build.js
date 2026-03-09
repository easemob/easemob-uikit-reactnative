#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { root_dir, current_dir, color_log } = require('./utils');

// --- Step 1: Patch react-native-agora podspec ---
// Switch from AgoraRtcEngine_iOS to AgoraRtcEngine_Special_iOS to resolve
// AgoraInfra_iOS version conflict with HyphenateChat (react-native-chat-sdk).

const podspecPath = path.join(
  root_dir,
  'node_modules',
  'react-native-agora',
  'react-native-agora.podspec'
);

color_log.info('[patch-ios-build] Patching react-native-agora podspec...');

if (!fs.existsSync(podspecPath)) {
  color_log.error(`Podspec not found: ${podspecPath}`);
  process.exit(1);
}

let podspecContent = fs.readFileSync(podspecPath, 'utf-8');

const podspecReplacements = [
  {
    from: "s.dependency 'AgoraRtcEngine_iOS', '4.5.2'",
    to: "s.dependency 'AgoraRtcEngine_Special_iOS', '4.5.2.140'",
  },
  {
    from: "s.dependency 'AgoraIrisRTC_iOS', '4.5.2-build.1'",
    to: "s.dependency 'AgoraIrisRTC_iOS', '4.5.2.140-build.6'",
  },
];

let podspecPatched = false;
for (const { from, to } of podspecReplacements) {
  if (podspecContent.includes(from)) {
    podspecContent = podspecContent.replace(from, to);
    color_log.success(`  Replaced: ${from}`);
    color_log.success(`      With: ${to}`);
    podspecPatched = true;
  } else if (podspecContent.includes(to)) {
    color_log.warning(`  Already patched: ${to}`);
  } else {
    color_log.warning(`  Pattern not found: ${from}`);
  }
}

if (podspecPatched) {
  fs.writeFileSync(podspecPath, podspecContent, 'utf-8');
  color_log.success('  Podspec patch applied.');
} else {
  color_log.info('  Podspec already up to date.');
}

// --- Step 2: Generate fix_aosl_conflicting.rb ---
// Multiple Pods may bundle aosl.xcframework (e.g. AgoraRtcEngine_Special_iOS
// and AgoraInfra_iOS from HyphenateChat). This Ruby module scans all Pod
// directories, reads each aosl.xcframework's version from Info.plist
// (CFBundleShortVersionString), keeps the highest version, and removes
// the rest. No Pod names are hardcoded — it works generically.

const iosDir = path.join(current_dir, 'ios');
const fixRbPath = path.join(iosDir, 'fix_aosl_conflicting.rb');

color_log.info('[patch-ios-build] Generating fix_aosl_conflicting.rb...');

if (!fs.existsSync(iosDir)) {
  color_log.warning(`ios directory not found: ${iosDir}, skipping.`);
} else {
  const fixRbContent = `require 'fileutils'

module PodHelpers
  # Scan all Pods for aosl.xcframework, compare versions via Info.plist,
  # keep the highest version, and delete the rest.
  def self.handle_aosl_conflict(installer)
    pods_root = installer.sandbox.root

    # 1. Find all Pods that contain aosl.xcframework
    aosl_entries = []
    Dir.glob(File.join(pods_root, '*', 'aosl.xcframework')).each do |xcfw_path|
      pod_name = File.basename(File.dirname(xcfw_path))

      # 2. Read version from Info.plist inside any arch slice
      info_plist = Dir.glob(File.join(xcfw_path, 'ios-arm64*', 'aosl.framework', 'Info.plist')).first
      unless info_plist
        puts "[aosl-dedup] WARNING: No Info.plist found in \#{xcfw_path}, skipping."
        next
      end

      version_str = %x(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "#{info_plist}" 2>/dev/null).strip
      if version_str.empty?
        puts "[aosl-dedup] WARNING: Could not read version from \#{info_plist}, skipping."
        next
      end

      aosl_entries << { pod: pod_name, path: xcfw_path, version: version_str }
    end

    if aosl_entries.size <= 1
      puts "[aosl-dedup] Found \#{aosl_entries.size} aosl.xcframework(s), no conflict to resolve."
      return
    end

    # 3. Sort by version (Gem::Version handles semantic version comparison)
    aosl_entries.sort_by! { |e| Gem::Version.new(e[:version]) }

    keep = aosl_entries.last
    puts "[aosl-dedup] Found \#{aosl_entries.size} aosl.xcframework(s):"
    aosl_entries.each do |entry|
      marker = entry == keep ? '  (keep)' : '  (remove)'
      puts "[aosl-dedup]   \#{entry[:pod]}: v\#{entry[:version]}\#{marker}"
    end

    # 4. Remove all lower-version copies
    aosl_entries[0..-2].each do |entry|
      puts "[aosl-dedup] Removing aosl.xcframework v\#{entry[:version]} from \#{entry[:pod]}"
      FileUtils.rm_rf(entry[:path])
    end

    puts "[aosl-dedup] Done. Kept aosl.xcframework v\#{keep[:version]} from \#{keep[:pod]}."
  end
end
`;
  fs.writeFileSync(fixRbPath, fixRbContent, 'utf-8');
  color_log.success(`  Created: ${fixRbPath}`);
}

// --- Step 3: Patch Podfile ---
// - Add require_relative for fix_aosl_conflicting.rb
// - Add pre_install hook to invoke aosl dedup

const podfilePath = path.join(iosDir, 'Podfile');

color_log.info('[patch-ios-build] Patching Podfile...');

if (!fs.existsSync(podfilePath)) {
  color_log.warning(`Podfile not found: ${podfilePath}, skipping.`);
} else {
  let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
  let podfileChanged = false;

  // 3a: Add require_relative and pre_install hook
  if (!podfileContent.includes('fix_aosl_conflicting')) {
    const requireLine = "require_relative 'fix_aosl_conflicting'";
    const preInstallBlock = [
      '',
      'pre_install do |installer|',
      '  PodHelpers.handle_aosl_conflict(installer)',
      'end',
      '',
    ].join('\n');

    const insertAfter =
      'require File.join(File.dirname(`node --print "require.resolve(\'react-native/package.json\')"`), "scripts/react_native_pods")';

    if (podfileContent.includes(insertAfter)) {
      podfileContent = podfileContent.replace(
        insertAfter,
        insertAfter + '\n' + requireLine
      );
    } else {
      podfileContent = requireLine + '\n' + podfileContent;
      color_log.warning(
        '  Could not find expected require line, prepended require_relative.'
      );
    }

    const targetMatch = podfileContent.match(/^(target\s+'.+'\s+do)/m);
    if (targetMatch) {
      podfileContent = podfileContent.replace(
        targetMatch[0],
        preInstallBlock + targetMatch[0]
      );
    } else {
      color_log.error('  Could not find target block in Podfile.');
      process.exit(1);
    }

    color_log.success('  Added aosl.xcframework dedup hook.');
    podfileChanged = true;
  } else {
    color_log.warning('  aosl dedup hook already present.');
  }

  if (podfileChanged) {
    fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
    color_log.success('  Podfile saved.');
  } else {
    color_log.info('  Podfile already up to date.');
  }
}
