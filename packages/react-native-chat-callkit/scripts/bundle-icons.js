#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const prettier = require('prettier');

const root = path.resolve(__dirname, '..');
// const root = path.resolve(__dirname, '../../../example');

const matchBigger = /_2x/;
const matchMax = /_3x/;
const ignorePatterns = /\.DS_Store|index\.ts/;
const iconDir = path.join(root, 'src', 'assets', 'icons');
const indexDir = path.join(root, 'src', 'assets');
const icons = {};

// const arr = [{xx:['', '.png' '', '2x', '3x']}, ...];
const arr = [];

const parseIcons = (_iconDir, relativeDir) => {
  // console.log('iconDir:', iconDir, 'relativeDir:', relativeDir);
  fs.readdirSync(_iconDir).forEach((filename) => {
    const s = fs.statSync(path.join(_iconDir, filename));
    // console.log('isDirectory:', s.isDirectory(), 'filename:', filename);
    if (s.isDirectory()) {
      parseIcons(
        path.join(_iconDir, filename),
        path.join(relativeDir, filename)
      );
    } else {
      if (filename.match(ignorePatterns)) return;

      const extType = filename.match(matchBigger)
        ? '_2x'
        : filename.match(matchMax)
          ? '_3x'
          : '';
      const ext = path.extname(filename);
      const key = filename.replace(ext, '').replace(/_2x|_3x/g, '');

      let last = arr[arr.length - 1];
      if (last === undefined) {
        arr.push({
          [key]: [relativeDir, ext],
        });
        last = arr[arr.length - 1];
      }

      const k = Object.keys(last).at(0);
      const v = last[k];

      if (v.length === 0) {
        v.push(extType);
      } else {
        if (k === key) {
          v.push(extType);
        } else {
          arr.push({
            [key]: [relativeDir, ext],
          });
          last = arr[arr.length - 1];
          last[key].push(extType);
        }
      }
    }
  });
};
parseIcons(iconDir, '');

arr.forEach((obj) => {
  const key = Object.keys(obj).at(0);
  const [rel, ext, x, x2, x3] = obj[key];
  const d1 = x;
  let d2 = x2;
  let d3 = x3;
  if (x !== undefined && x2 !== undefined && x3 !== undefined) {
    /* empty */
  } else if (x !== undefined && x2 !== undefined) {
    d3 = d2;
  } else if (x !== undefined) {
    d3 = d2 = d1;
  } else {
    throw new Error('impossible');
  }
  console.log('test:', key, rel, ext, d1, d2, d3);
  if (rel === '') {
    icons[key] =
      `$$start(size: string) => { if (size === '3x') { return require('./icons/${key}${d3}${ext}'); } else if (size === '2x') { return require('./icons/${key}${d2}${ext}'); } else { return require('./icons/${key}${d1}${ext}'); }}$$end`;
  } else {
    icons[key] =
      `$$start(size: string) => { if (size === '3x') { return require('./icons/${rel}/${key}${d3}${ext}'); } else if (size === '2x') { return require('./icons/${rel}/${key}${d2}${ext}'); } else { return require('./icons/${rel}/${key}${d1}${ext}'); }}$$end`;
  }
});

const serializedIcons = JSON.stringify(icons, null, 4).replace(
  /("\$\$start)(.+)(\$\$end")/g,
  (_, a, b, c) => {
    return a.replace('"$$start', '') + b + c.replace('$$end"', '');
  }
);

const exportString = `
// This file is generated automatically. Please do not edit it manually. If necessary, you can run the 'scripts/bundle-icons.js' script to generate it again.\n
export const ICON_ASSETS = ${serializedIcons};\n
`;

fs.writeFileSync(
  path.join(indexDir, 'icons.ts'),
  prettier.format(exportString, {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'preserve',
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
  })
);
