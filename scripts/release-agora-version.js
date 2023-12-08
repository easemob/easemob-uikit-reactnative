// todo: 获取指定版本号 `node scripts/release-agora-version.js ${new-version} ${old-version} ${new-name} ${old-name}`
// todo: 在指定目录使用命令 `npm pack` 生成 tar 包
// todo: 在指定目录使用命令 `tar -xvf xxx.tar` 解压 tar 包
// todo: 在指定目录修改文件夹名字 `package` 为 `${new-name}`
// todo: 在指定目录修改 `package.json` 配置文件中的包名
// todo: 在指定目录修改 `package.json` 配置文件中的版本号
// todo: 在指定目录使用命令 `zip -r xxx.zip ./*` 压缩文件

/* eslint-disable import/no-commonjs */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const enableLog = false;
const workingDirectory = process.cwd();
const jsDirectory = __dirname;
console.log('workingDirectory:', workingDirectory);
console.log('jsDirectory:', jsDirectory);

const logFile = path.join(jsDirectory, '/release.log');
const logStream = fs.createWriteStream(logFile, 'utf8');
const logType = enableLog === true ? 'inherit' : 'ignore';

// 清空上次日志
// fs.existsSync(logFile) && fs.truncateSync(logFile, 0);

// 获取版本号
const new_version = process.argv[2];
const old_version = process.argv[3];
const new_name = process.argv[4];
const old_name = process.argv[5];

if (!new_version || !old_version || !new_name || !old_name) {
  console.error(
    '请提供版本号，例如：node scripts/release-agora-version.js ${new-version} ${old-version} ${new-name} ${old-name}'
  );
  process.exit(1);
}

// 使用命令 `npm pack` 生成 tar 包
execSync('npm pack', {
  stdio: logType,
  cwd: workingDirectory,
});

// tar 包的名字
const tarName = `${old_name}-${old_version}.tgz`;

// 使用命令 `tar -xvf xxx.tar` 解压 tar 包
// const tarFolder = path.join(__dirname, `../packages/${old_name}`);
execSync(`tar -xf ${tarName}`, {
  stdio: logType,
  cwd: workingDirectory,
});

// 使用命令 `mv package ${new-name}` 修改文件夹名字
const packageFolder = path.join(__dirname, `../packages/${old_name}`);
execSync(`mv package ${new_name}-${new_version}`, {
  stdio: logType,
  cwd: workingDirectory,
});

// 修改 `package.json` 配置文件中的包名和版本号
// const packageJsonPath = path.join(
//   __dirname,
//   `../packages/${old_name}/${new_name}-${new_version}/package.json`
// );
const packageJson = require(`${packageFolder}/${new_name}-${new_version}/package.json`);

packageJson.name = new_name; // 替换为新的包名
packageJson.version = new_version;
delete packageJson.scripts['manual-release'];
delete packageJson.scripts['prepack'];

// fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
fs.writeFileSync(
  `${packageFolder}/${new_name}-${new_version}/package.json`,
  JSON.stringify(packageJson, null, 2)
);

// 修改其他文件里面的版本号
const files = [
  'lib/commonjs/version.js',
  'lib/module/version.js',
  'lib/typescript/src/version.d.ts',
  'src/version.ts',
];
files.forEach((file) => {
  const filePath = `${packageFolder}/${new_name}-${new_version}/${file}`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const newFileContent = fileContent.replace(old_version, new_version);
  fs.writeFileSync(filePath, newFileContent);
});

// 使用命令 `zip -r xxx.zip ./*` 压缩文件
execSync(
  `zip -r ${new_name}-${new_version}.zip ${new_name}-${new_version} > /dev/null`,
  {
    stdio: logType,
    cwd: workingDirectory,
  }
);

// 删除临时文件夹
execSync(`rm -rf ${packageFolder}/${new_name}-${new_version}`, {
  stdio: logType,
});

// 关闭日志文件
logStream.on('finish', function () {
  console.log('All writes are now complete.');
});
logStream.end();
