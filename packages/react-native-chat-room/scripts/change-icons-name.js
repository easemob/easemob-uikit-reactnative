#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const ignorePatterns = /@2x|@3x|U\+|-|'/g;
const iconDir = path.join(root, 'src', 'assets', 'icons');

const changeNames = (_iconDir) => {
  // console.log('iconDir:', iconDir);
  fs.readdirSync(_iconDir).forEach((filename) => {
    const s = fs.statSync(path.join(_iconDir, filename));
    // console.log('isDirectory:', s.isDirectory(), 'filename:', filename);
    if (s.isDirectory()) {
      changeNames(path.join(_iconDir, filename));
    } else {
      if (filename.match(ignorePatterns)) {
        const r = filename.replace(ignorePatterns, (full, a) => {
          console.log(filename, a, full);
          if (full === '@2x') {
            return '_2x';
          } else if (full === '@3x') {
            return '_3x';
          } else if (full === 'U+') {
            return 'U_';
          } else if (full === '-') {
            return '_';
          } else if (full === "'") {
            return '_';
          } else {
            return new Error('impossible');
          }
        });
        console.log('r:', r);
        console.log(path.join(_iconDir, filename), path.join(_iconDir, r));
        fs.rename(
          path.join(_iconDir, filename),
          path.join(_iconDir, r),
          (err) => {
            console.log('error:', err);
          }
        );
      }
    }
  });
};

changeNames(iconDir);
