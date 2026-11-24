require 'xcodeproj'

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
