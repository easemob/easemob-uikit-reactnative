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

    # SPM mode (USE_FRAMEWORKS=dynamic): aosl is provided by the SPM package
    # ShengwangInfra_iOS (transitive dependency of HyphenateChat_iOS). Remove
    # every Pod-bundled aosl.xcframework so CocoaPods does not embed a second
    # aosl.framework ("Multiple commands produce .../aosl.framework").
    if ENV['USE_FRAMEWORKS'] == 'dynamic'
      Dir.glob(File.join(pods_root, '*', 'aosl.xcframework')).each do |xcfw_path|
        puts "[aosl-dedup] SPM mode: removing Pod-bundled \#{xcfw_path} (aosl comes from SPM)."
        FileUtils.rm_rf(xcfw_path)
      end
      return
    end

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


// --- Step 4: Embed HyphenateChat SPM frameworks into the app target ---
// With USE_FRAMEWORKS=dynamic, ChatSdk.podspec pulls HyphenateChat via RN's
// `spm_dependency`, which attaches the SPM products to the ChatSdk *pod*
// target. Xcode only embeds SPM products attached to the *app* target, so
// the app crashes at launch with "Library not loaded:
// @rpath/HyphenateChat.framework/HyphenateChat". The generated Ruby helper
// attaches the HyphenateChat / ShengwangInfra products to the app target
// (link + embed) during `pod install`. It is a no-op for CocoaPods-mode
// installs (HyphenateChat pod is embedded by CocoaPods itself).

const embedRbPath = path.join(iosDir, 'embed_spm_frameworks.rb');

color_log.info('[patch-ios-build] Generating embed_spm_frameworks.rb...');

if (!fs.existsSync(iosDir)) {
  color_log.warning(`ios directory not found: ${iosDir}, skipping.`);
} else {
  const embedRbContent = `require 'xcodeproj'

# With USE_FRAMEWORKS=dynamic, ChatSdk.podspec integrates HyphenateChat via
# RN's spm_dependency, attaching the SPM products to the ChatSdk pod target.
# Xcode only embeds SPM products attached to the *app* target; without this
# hook the app crashes at launch ("Library not loaded:
# @rpath/HyphenateChat.framework/HyphenateChat"). Attach the products to the
# app target here; linking an SPM product on the app target makes
# Xcode embed it automatically. No-op unless USE_FRAMEWORKS=dynamic, so
# CocoaPods-mode installs (HyphenateChat pod, embedded by CocoaPods) are
# untouched.
module SpmEmbed
  PACKAGES = [
    {
      url: 'https://github.com/easemob/HyphenateChat_iOS.git',
      requirement: { kind: 'upToNextMinorVersion', minimumVersion: '5.0.0' },
      products: ['HyphenateChat'],
    },
    {
      url: 'https://github.com/Shengwang-Lab/ShengwangInfra_iOS.git',
      requirement: { kind: 'upToNextMajorVersion', minimumVersion: '1.3.5' },
      products: ['ShengwangInfra_iOS'],
    },
  ].freeze

  def self.embed_spm_products(installer)
    unless ENV['USE_FRAMEWORKS'] == 'dynamic'
      return
    end

    installer.aggregate_targets.each do |aggregate_target|
      project = aggregate_target.user_project
      aggregate_target.user_targets.each do |target|
        next unless target.respond_to?(:package_product_dependencies)
        PACKAGES.each do |package_spec|
          pkg = ensure_package_reference(project, package_spec)
          package_spec[:products].each do |product_name|
            ref = ensure_product_dependency(project, target, pkg, product_name)
            link_product(project, target, ref)
          end
        end
        Pod::UI.puts '[SpmEmbed] Attached HyphenateChat SPM products to app target: ' + target.name
      end
    end
  end

  def self.ensure_package_reference(project, package_spec)
    ref_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
    pkg = project.root_object.package_references.find do |p|
      p.is_a?(ref_class) && p.repositoryURL == package_spec[:url]
    end
    return pkg if pkg

    pkg = project.new(ref_class)
    pkg.repositoryURL = package_spec[:url]
    pkg.requirement = package_spec[:requirement]
    project.root_object.package_references << pkg
    pkg
  end

  def self.ensure_product_dependency(project, target, pkg, product_name)
    dep_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency
    ref = target.package_product_dependencies.find do |r|
      r.is_a?(dep_class) && r.product_name == product_name
    end
    return ref if ref

    ref = project.new(dep_class)
    ref.package = pkg
    ref.product_name = product_name
    target.package_product_dependencies << ref
    ref
  end

  def self.build_file_for(project, ref, settings = nil)
    build_file = project.new(Xcodeproj::Project::Object::PBXBuildFile)
    build_file.product_ref = ref
    build_file.settings = settings if settings
    build_file
  end

  def self.link_product(project, target, ref)
    phase = target.frameworks_build_phase
    return if phase.files.any? { |bf| bf.product_ref == ref }

    phase.files << build_file_for(project, ref)
  end
end
`;
  fs.writeFileSync(embedRbPath, embedRbContent, 'utf-8');
  color_log.success(`  Created: ${embedRbPath}`);

  // Wire the helper into the Podfile: require + post_install call.
  if (fs.existsSync(podfilePath)) {
    let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
    let podfileChanged = false;

    if (!podfileContent.includes('embed_spm_frameworks')) {
      const requireAnchor = "require_relative 'fix_aosl_conflicting'";
      if (podfileContent.includes(requireAnchor)) {
        podfileContent = podfileContent.replace(
          requireAnchor,
          requireAnchor + "\nrequire_relative 'embed_spm_frameworks'"
        );
      } else {
        podfileContent =
          "require_relative 'embed_spm_frameworks'\n" + podfileContent;
        color_log.warning(
          '  Could not find fix_aosl_conflicting require, prepended embed_spm_frameworks require.'
        );
      }

      const postInstallMatch = podfileContent.match(
        /^(\s*post_install do \|installer\|)$/m
      );
      if (postInstallMatch) {
        podfileContent = podfileContent.replace(
          postInstallMatch[0],
          postInstallMatch[0] + '\n    SpmEmbed.embed_spm_products(installer)'
        );
      } else {
        color_log.error('  Could not find post_install block in Podfile.');
        process.exit(1);
      }

      podfileChanged = true;
      color_log.success('  Added SPM embed hook to Podfile.');
    } else {
      color_log.warning('  SPM embed hook already present.');
    }

    if (podfileChanged) {
      fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
      color_log.success('  Podfile saved.');
    }
  }

  // --- Step 5: Default iOS integration to SPM mode ---
  // CocoaPods trunk is winding down and key dependencies already require
  // dynamic frameworks (e.g. @react-native-firebase 27), so this example
  // defaults to `use_frameworks! :linkage => :dynamic`. The Podfile reads
  // ios/Podfile.properties.json first, so every `pod install` — including
  // the implicit one from `expo run:ios` — produces a dynamic-framework
  // integration. To fall back to classic static CocoaPods, remove the
  // `ios.useFrameworks` key, delete `Pods` + `Podfile.lock`, and re-run
  // `pod install`.
  const podfilePropertiesPath = path.join(iosDir, 'Podfile.properties.json');
  if (fs.existsSync(podfilePropertiesPath)) {
    const podfileProperties = JSON.parse(
      fs.readFileSync(podfilePropertiesPath, 'utf-8')
    );
    if (podfileProperties['ios.useFrameworks'] !== 'dynamic') {
      podfileProperties['ios.useFrameworks'] = 'dynamic';
      fs.writeFileSync(
        podfilePropertiesPath,
        JSON.stringify(podfileProperties, null, 2) + '\n',
        'utf-8'
      );
      color_log.success(
        '  Set ios.useFrameworks=dynamic in Podfile.properties.json.'
      );
    } else {
      color_log.warning('  ios.useFrameworks already set to dynamic.');
    }
  }
}
