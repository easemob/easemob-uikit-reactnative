module PodHelpers
  def self.handle_aosl_conflict(installer)
    # 定义 AgoraRtcEngine_iOS framework 的路径
    rtc_pod_path = File.join(installer.sandbox.root, 'AgoraRtcEngine_iOS')

    # aosl.xcframework 的完整路径
    aosl_xcframework_path = File.join(rtc_pod_path, 'aosl.xcframework')

    # 检查文件是否存在，如果存在则删除
    if File.exist?(aosl_xcframework_path)
      puts "Deleting aosl.xcframework from #{aosl_xcframework_path}"
      FileUtils.rm_rf(aosl_xcframework_path)
    else
      puts "aosl.xcframework not found, skipping deletion."
    end
  end
end
