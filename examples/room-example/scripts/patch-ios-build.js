#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { current_dir, color_log } = require('./utils');

// This example has no Agora dependency, so unlike callkit-example /
// product-uikit-demo it only needs the SPM embed step (step 4 of their
// patch-ios-build.js): with USE_FRAMEWORKS=dynamic, ChatSdk.podspec pulls
// HyphenateChat via RN's spm_dependency, which attaches the SPM products to
// the ChatSdk *pod* target. Xcode only embeds SPM products attached to the
// *app* target, so without this hook the app crashes at launch with
// "Library not loaded: @rpath/HyphenateChat.framework/HyphenateChat".

const iosDir = path.join(current_dir, 'ios');
const podfilePath = path.join(iosDir, 'Podfile');

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
