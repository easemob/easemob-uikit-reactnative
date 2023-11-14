#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const prettier = require('prettier');

const root = path.resolve(__dirname, '..');

const pattern1 = /_3x|__3x/g;
const pattern2 = /U_/g;
const pattern3 = /\.png/g;
const faceDir = path.join(root, 'src', 'assets', 'icons', 'moji');
const indexDir = path.join(root, 'src', 'assets');

const generateFaces = (_faceDir) => {
  const result = [];

  fs.readdirSync(_faceDir).forEach((filename) => {
    const s = fs.statSync(path.join(_faceDir, filename));
    if (s.isDirectory()) {
      generateFaces(path.join(_faceDir, filename));
    } else {
      if (filename.match(pattern1)) {
        const r = filename.replace(pattern1, () => {
          return '';
        });
        const rr = r.replace(pattern2, () => {
          return '';
        });
        const rrr = rr.replace(pattern3, () => {
          return '';
        });
        // console.log('rrr:', filename, r, rr, rrr, rrr.toLowerCase());
        result.push(rrr.toLowerCase());
      }
    }
  });

  const r = result.map((value) => {
    return value.toString();
  });
  console.log('js:r:', r);

  const exportString = `
// This file is generated automatically. Please do not edit it manually. If necessary, you can run the 'scripts/bundle-icons.js' script to generate it again.\n
export const FACE_ASSETS = ${JSON.stringify(result)};\n
`;

  fs.writeFileSync(
    path.join(indexDir, 'faces.ts'),
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
};

generateFaces(faceDir);
