# aosl-fix.gradle 方案设计（v2）

## 设计思路

**双层机制**：

1. **Maven `exclude`**：移除不需要的远程 aosl 依赖（配置阶段）
2. **物理删除 `.so`**：移除内嵌在 AAR 中的 aosl .so 文件（任务执行阶段）

**输入参数**：`aosl_prefer`（默认 `"easemob"`）

- `"easemob"` → 保留 hyphenate-chat 的 aosl，删除 agora 的
- `"agora"` → 保留 agora 的 aosl，删除 hyphenate-chat 的

---

## 三个场景

### 场景 1：两个远程依赖都存在

**对应版本组合**：hyphenate-chat ≥ 4.19.0 + Agora full-sdk（非 special）

```
transforms/aosl-1.3.0/jni/arm64-v8a/libaosl.so         ← cn.shengwang.infra:aosl:1.3.0
transforms/aosl-1.2.13.1/jni/arm64-v8a/libaosl.so      ← io.agora.infra:aosl:1.2.13.1
```

**处理**：

- 两个路径都包含 `aosl-{version}` 格式，**可以提取并比较版本**
- 自动 `exclude` 低版本的远程依赖
- 不需要用户参数，全自动

### 场景 2：只有一个远程依赖

**对应版本组合**：

- 2a: hyphenate-chat 4.18.x（内嵌）+ full-sdk（远程 `io.agora.infra:aosl`）← **当前状态**
- 2b: hyphenate-chat ≥ 4.19.0（远程 `cn.shengwang.infra:aosl`）+ agora-special-full（内嵌）

```
# 2a 当前状态:
transforms/hyphenate-chat-4.18.1/jni/arm64-v8a/libaosl.so   ← 内嵌，无法提取 aosl 版本
transforms/aosl-1.2.13.1/jni/arm64-v8a/libaosl.so           ← 远程，版本已知
```

**处理**：

- 根据 `aosl_prefer` 参数决定
- 如果 prefer=easemob → `exclude group: 'io.agora.infra', module: 'aosl'`，物理保留 hyphenate 的 .so
- 如果 prefer=agora → 物理删除 hyphenate 的 .so，保留远程 aosl

### 场景 3：两个远程依赖都不存在

**对应版本组合**：hyphenate-chat 4.18.x（内嵌）+ agora-special-full（内嵌）

```
transforms/hyphenate-chat-4.18.1/jni/arm64-v8a/libaosl.so        ← 内嵌
transforms/agora-special-full-4.5.2.140/jni/arm64-v8a/libaosl.so ← 内嵌
```

**处理**：

- 根据 `aosl_prefer` 参数决定
- 如果 prefer=easemob → 物理删除路径含 `agora` 的 .so
- 如果 prefer=agora → 物理删除路径含 `hyphenate` 的 .so

---

## 检测逻辑

使用 Gradle 的 `configurations` API 检测已解析的远程依赖：

```groovy
def hasShengwangAosl = false  // cn.shengwang.infra:aosl
def hasAgoraInfraAosl = false // io.agora.infra:aosl
def shengwangAoslVersion = null
def agoraInfraAoslVersion = null

configurations.matching { it.canBeResolved }.each { config ->
    try {
        config.resolvedConfiguration.resolvedArtifacts.each { artifact ->
            def id = artifact.moduleVersion.id
            if (id.group == 'cn.shengwang.infra' && id.name == 'aosl') {
                hasShengwangAosl = true
                shengwangAoslVersion = id.version
            }
            if (id.group == 'io.agora.infra' && id.name == 'aosl') {
                hasAgoraInfraAosl = true
                agoraInfraAoslVersion = id.version
            }
        }
    } catch (e) { /* ignore unresolvable configs */ }
}
```

## 决策矩阵

| hasShengwangAosl | hasAgoraInfraAosl | 动作                               |
| ---------------- | ----------------- | ---------------------------------- |
| ✅               | ✅                | 场景 1：比较版本，exclude 低版本的 |
| ❌               | ✅                | 场景 2a：根据 `aosl_prefer`        |
| ✅               | ❌                | 场景 2b：根据 `aosl_prefer`        |
| ❌               | ❌                | 场景 3：根据 `aosl_prefer`         |

---

## 完整代码

```groovy
// aosl-fix.gradle
//
// Resolves duplicate libaosl.so from hyphenate-chat and Agora RTC SDK.
// Design mirrors iOS fix_aosl_conflicting.rb: detect → decide → remove.
//
// Usage in build.gradle:
//   ext.aosl_prefer = "easemob"  // or "agora"
//   apply from: file('aosl-fix.gradle')

def prefer = project.hasProperty('aosl_prefer') ? project.aosl_prefer : "easemob"

// ──── Phase 1: Detect remote aosl dependencies ────

afterEvaluate {
    def hasShengwangAosl = false   // cn.shengwang.infra:aosl (from hyphenate-chat >= 4.19)
    def hasAgoraInfraAosl = false  // io.agora.infra:aosl (from Agora full-sdk)
    def shengwangAoslVersion = null
    def agoraInfraAoslVersion = null

    configurations.matching { it.canBeResolved }.each { config ->
        try {
            config.resolvedConfiguration.resolvedArtifacts.each { artifact ->
                def id = artifact.moduleVersion.id
                if (id.group == 'cn.shengwang.infra' && id.name == 'aosl') {
                    hasShengwangAosl = true
                    shengwangAoslVersion = id.version
                }
                if (id.group == 'io.agora.infra' && id.name == 'aosl') {
                    hasAgoraInfraAosl = true
                    agoraInfraAoslVersion = id.version
                }
            }
        } catch (Exception e) { /* skip unresolvable */ }
    }

    println "[aosl-fix] Detected remote aosl dependencies:"
    println "[aosl-fix]   cn.shengwang.infra:aosl = ${hasShengwangAosl ? shengwangAoslVersion : 'not found'}"
    println "[aosl-fix]   io.agora.infra:aosl     = ${hasAgoraInfraAosl ? agoraInfraAoslVersion : 'not found'}"

    // ──── Phase 2: Decide which to exclude ────

    def excludeGroup = null   // Maven group to exclude (if any)
    def deletePattern = null  // Path keyword for physical .so deletion

    if (hasShengwangAosl && hasAgoraInfraAosl) {
        // Scenario 1: Both remote → compare versions, exclude lower
        def va = shengwangAoslVersion.tokenize('.').collect { it as int }
        def vb = agoraInfraAoslVersion.tokenize('.').collect { it as int }
        def len = Math.max(va.size(), vb.size())
        def cmp = 0
        for (int i = 0; i < len && cmp == 0; i++) {
            cmp = (i < va.size() ? va[i] : 0) <=> (i < vb.size() ? vb[i] : 0)
        }

        if (cmp >= 0) {
            // shengwang >= agora → exclude agora
            excludeGroup = 'io.agora.infra'
            println "[aosl-fix] Scenario 1: cn.shengwang.infra:aosl:${shengwangAoslVersion} >= io.agora.infra:aosl:${agoraInfraAoslVersion}"
            println "[aosl-fix]   → Excluding io.agora.infra:aosl"
        } else {
            // agora > shengwang → exclude shengwang
            excludeGroup = 'cn.shengwang.infra'
            println "[aosl-fix] Scenario 1: io.agora.infra:aosl:${agoraInfraAoslVersion} > cn.shengwang.infra:aosl:${shengwangAoslVersion}"
            println "[aosl-fix]   → Excluding cn.shengwang.infra:aosl"
        }
    } else if (hasAgoraInfraAosl && !hasShengwangAosl) {
        // Scenario 2a: Only agora remote, hyphenate embedded
        if (prefer == "easemob") {
            excludeGroup = 'io.agora.infra'
            println "[aosl-fix] Scenario 2a: Prefer easemob → excluding io.agora.infra:aosl"
        } else {
            deletePattern = 'hyphenate'
            println "[aosl-fix] Scenario 2a: Prefer agora → will delete hyphenate-chat embedded aosl"
        }
    } else if (hasShengwangAosl && !hasAgoraInfraAosl) {
        // Scenario 2b: Only shengwang remote, agora embedded
        if (prefer == "easemob") {
            deletePattern = 'agora'
            println "[aosl-fix] Scenario 2b: Prefer easemob → will delete agora embedded aosl"
        } else {
            excludeGroup = 'cn.shengwang.infra'
            println "[aosl-fix] Scenario 2b: Prefer agora → excluding cn.shengwang.infra:aosl"
        }
    } else {
        // Scenario 3: Neither remote, both embedded
        if (prefer == "easemob") {
            deletePattern = 'agora'
            println "[aosl-fix] Scenario 3: Prefer easemob → will delete agora embedded aosl"
        } else {
            deletePattern = 'hyphenate'
            println "[aosl-fix] Scenario 3: Prefer agora → will delete hyphenate embedded aosl"
        }
    }

    // ──── Phase 3a: Apply Maven exclude ────

    if (excludeGroup != null) {
        configurations.all {
            exclude group: excludeGroup, module: 'aosl'
        }
        println "[aosl-fix] Applied: exclude group: '${excludeGroup}', module: 'aosl'"
    }

    // ──── Phase 3b: Physical .so deletion (for embedded aosl) ────

    if (deletePattern != null) {
        tasks.matching {
            it.name.contains("merge") &&
            (it.name.contains("JniLib") || it.name.contains("NativeLib"))
        }.configureEach { task ->
            task.doFirst {
                def inputFiles = null
                if (task.hasProperty('inputFiles')) {
                    inputFiles = task.inputFiles
                } else if (task.hasProperty('inputs')) {
                    inputFiles = task.inputs.files
                }

                if (inputFiles == null) {
                    println "[aosl-fix] WARNING: Cannot access input files for ${task.name}"
                    return
                }

                inputFiles.files.each { file ->
                    if (!file.exists() || !file.isDirectory()) return
                    fileTree(file).matching { include '**/libaosl.so' }.each { soFile ->
                        def filePath = soFile.absolutePath
                        if (filePath.contains(deletePattern)) {
                            println "[aosl-fix] Deleting embedded libaosl.so: ${filePath}"
                            soFile.delete()
                        } else {
                            println "[aosl-fix] Keeping libaosl.so: ${filePath}"
                        }
                    }
                }
            }
        }
    }
}
```

---

## 与当前项目的集成

[patch-android-build.js](file:///Users/asterisk/tmp2026/2026-02-28/react-native-chat-library/examples/product-uikit-demo/scripts/patch-android-build.js) 需要：

1. **生成 [aosl-fix.gradle](file:///Users/asterisk/Codes/rn/react-native-chat-library-3.0/examples/product-uikit-demo/android/app/aosl-fix.gradle)** 到 `android/app/` 目录
2. **在 [build.gradle](file:///Users/asterisk/Codes/rn/react-native-chat-library-3.0/examples/product-uikit-demo/android/app/build.gradle) 末尾注入**：
   ```groovy
   ext.aosl_prefer = "easemob"
   apply from: file('aosl-fix.gradle')
   ```
3. **保留 `pickFirst`** 作为安全网（万一检测/删除失败，构建不会崩）

```
patch-android-build.js
  ├─ Fix 1: androidsvg exclusion                        (注入 build.gradle)
  ├─ Fix 2: pickFirst libaosl.so                        (注入 build.gradle, 安全网)
  └─ Fix 3: 生成 aosl-fix.gradle + apply from          (新增)
```
