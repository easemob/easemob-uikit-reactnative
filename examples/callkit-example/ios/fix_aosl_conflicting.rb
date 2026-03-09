require 'fileutils'

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
        puts "[aosl-dedup] WARNING: No Info.plist found in #{xcfw_path}, skipping."
        next
      end

      version_str = %x(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "#{info_plist}" 2>/dev/null).strip
      if version_str.empty?
        puts "[aosl-dedup] WARNING: Could not read version from #{info_plist}, skipping."
        next
      end

      aosl_entries << { pod: pod_name, path: xcfw_path, version: version_str }
    end

    if aosl_entries.size <= 1
      puts "[aosl-dedup] Found #{aosl_entries.size} aosl.xcframework(s), no conflict to resolve."
      return
    end

    # 3. Sort by version (Gem::Version handles semantic version comparison)
    aosl_entries.sort_by! { |e| Gem::Version.new(e[:version]) }

    keep = aosl_entries.last
    puts "[aosl-dedup] Found #{aosl_entries.size} aosl.xcframework(s):"
    aosl_entries.each do |entry|
      marker = entry == keep ? '  (keep)' : '  (remove)'
      puts "[aosl-dedup]   #{entry[:pod]}: v#{entry[:version]}#{marker}"
    end

    # 4. Remove all lower-version copies
    aosl_entries[0..-2].each do |entry|
      puts "[aosl-dedup] Removing aosl.xcframework v#{entry[:version]} from #{entry[:pod]}"
      FileUtils.rm_rf(entry[:path])
    end

    puts "[aosl-dedup] Done. Kept aosl.xcframework v#{keep[:version]} from #{keep[:pod]}."
  end
end
