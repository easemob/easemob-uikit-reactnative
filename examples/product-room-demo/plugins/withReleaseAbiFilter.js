/**
 * Custom Expo config plugin to filter ABI architectures for release builds.
 *
 * This reduces APK size by excluding non-arm64 architectures from release builds,
 * while keeping all architectures (including x86/x86_64) for debug builds to support emulators.
 *
 * Background: React Native Gradle Plugin (RNGP) reads `reactNativeArchitectures` from
 * gradle.properties and unions all listed architectures into `defaultConfig.ndk.abiFilters`.
 * AGP merges (unions) abiFilters across defaultConfig and buildTypes, so setting abiFilters
 * only in the release buildType is ineffective. Additionally, AGP 8.x+ finalizes variant
 * configuration before afterEvaluate, so clearing defaultConfig.ndk.abiFilters there is too late.
 *
 * Solution: use the AGP androidComponents Variant API to add jniLibs.excludes for unwanted
 * ABIs in release builds. This operates at the packaging stage, after all dependency .so files
 * are resolved, and is per-variant so debug builds keep all architectures.
 *
 * Usage in app.json:
 *   ["./plugins/withReleaseAbiFilter"]
 *   or with custom ABIs:
 *   ["./plugins/withReleaseAbiFilter", { "abis": ["arm64-v8a", "armeabi-v7a"] }]
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

const ALL_ABIS = ['armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'];

/**
 * @param {import('@expo/config-plugins').ExpoConfig} config
 * @param {{ abis?: string[] }} options
 * @returns {import('@expo/config-plugins').ExpoConfig}
 */
module.exports = function withReleaseAbiFilter(config, options = {}) {
  const abis = options.abis || ['arm64-v8a'];
  const excludedAbis = ALL_ABIS.filter((abi) => !abis.includes(abi));

  if (excludedAbis.length === 0) return config;

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const marker = 'variant.packaging.jniLibs.excludes';
    if (contents.includes(marker)) {
      return config;
    }

    const excludePatterns = excludedAbis
      .map((abi) => `"lib/${abi}/**"`)
      .join(', ');

    contents += `\nandroidComponents {\n    onVariants(selector().withBuildType("release")) { variant ->\n        variant.packaging.jniLibs.excludes.addAll(${excludePatterns})\n    }\n}\n`;

    config.modResults.contents = contents;
    return config;
  });
};
