#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const current_dir = path.resolve(__dirname, '..');

const current_package = JSON.parse(
  fs.readFileSync(path.join(current_dir, 'package.json'), 'utf8')
);

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  // 字体颜色
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  // 背景颜色
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  // 样式
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
};

// 彩色日志函数
const color_log = {
  error: (...args) => {
    const coloredArgs = args.map((arg) => `${colors.red}${arg}${colors.reset}`);
    console.log(...coloredArgs);
  },
  success: (...args) => {
    const coloredArgs = args.map(
      (arg) => `${colors.green}${arg}${colors.reset}`
    );
    console.log(...coloredArgs);
  },
  info: (...args) => {
    const coloredArgs = args.map(
      (arg) => `${colors.blue}${arg}${colors.reset}`
    );
    console.log(...coloredArgs);
  },
  warning: (...args) => {
    const coloredArgs = args.map(
      (arg) => `${colors.yellow}${arg}${colors.reset}`
    );
    console.log(...coloredArgs);
  },
  highlight: (...args) => {
    const coloredArgs = args.map(
      (arg) => `${colors.magenta}${arg}${colors.reset}`
    );
    console.log(...coloredArgs);
  },
  // 自定义颜色
  custom: (color, ...args) => {
    const coloredArgs = args.map((arg) => `${color}${arg}${colors.reset}`);
    console.log(...coloredArgs);
  },
};

module.exports = {
  current_package,
  current_dir,
  colors,
  color_log,
};

// 使用示例
// color_log.success('成功信息');
// color_log.error('错误信息');
// color_log.info('一般信息');
// color_log.warning('警告信息');
// color_log.custom('自定义颜色', colors.cyan);
// console.log(`${colors.bright}${colors.bgYellow}${colors.blue}带背景色和样式的文本${colors.reset}`);
