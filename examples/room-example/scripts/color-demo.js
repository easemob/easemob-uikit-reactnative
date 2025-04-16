#!/usr/bin/env node

const { colors, color_log } = require('./utils');

// 基本颜色示例
console.log('\n基本颜色示例:');
color_log.success('✓ 成功信息 - Success message');
color_log.success('✓ 成功信息 - Success message', 1, 2, 'test');
color_log.success(`✓ 成功信息 - Success message ${1}, ${'test'}`);
color_log.error('✗ 错误信息 - Error message');
color_log.info('ℹ 一般信息 - Info message');
color_log.warning('⚠ 警告信息 - Warning message');
color_log.highlight('★ 高亮信息 - Highlighted message');

// 自定义颜色
console.log('\n自定义颜色示例:');
color_log.custom(colors.cyan, '自定义青色文本 - Custom cyan text');
color_log.custom(colors.white, '自定义白色文本 - Custom white text');
color_log.custom(colors.cyan, '可以传递', '多个参数', '使用相同颜色');

// 样式组合
console.log('\n样式组合示例:');
console.log(
  `${colors.bright}${colors.red}亮红色文本 - Bright red text${colors.reset}`
);
console.log(
  `${colors.underline}${colors.green}带下划线的绿色文本 - Underlined green text${colors.reset}`
);
console.log(
  `${colors.bgBlue}${colors.white}白色文本蓝色背景 - White text on blue background${colors.reset}`
);
console.log(
  `${colors.italic}${colors.yellow}斜体黄色文本 - Italic yellow text${colors.reset}`
);

// 多样式组合
console.log('\n复杂样式组合:');
console.log(
  `${colors.bright}${colors.bgYellow}${colors.blue}明亮的蓝色文本在黄色背景上 - Bright blue text on yellow background${colors.reset}`
);
console.log(
  `${colors.underline}${colors.bgRed}${colors.white}带下划线的白色文本在红色背景上 - Underlined white text on red background${colors.reset}`
);

// 提示信息
console.log('\n实用提示格式:');
console.log(
  `${colors.green}➜${colors.reset} ${colors.bright}正在构建项目... - Building project...${colors.reset}`
);
console.log(
  `${colors.blue}ℹ${colors.reset} ${colors.dim}正在下载依赖... - Downloading dependencies...${colors.reset}`
);
console.log(
  `${colors.yellow}⚠${colors.reset} ${colors.bright}${colors.yellow}发现潜在问题 - Potential issue detected${colors.reset}`
);
console.log(
  `${colors.red}✗${colors.reset} ${colors.bright}${colors.red}构建失败 - Build failed${colors.reset}`
);

// 特殊效果
console.log('\n特殊效果:');
const rainbow = '彩虹文本 - Rainbow text';
const rainbowColors = [
  colors.red,
  colors.yellow,
  colors.green,
  colors.cyan,
  colors.blue,
  colors.magenta,
];
let rainbowText = '';
for (let i = 0; i < rainbow.length; i++) {
  const color = rainbowColors[i % rainbowColors.length];
  rainbowText += `${color}${rainbow[i]}`;
}
console.log(rainbowText + colors.reset);
