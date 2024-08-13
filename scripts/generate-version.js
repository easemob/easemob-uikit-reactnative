#!/usr/bin/env node

/* eslint-disable import/no-commonjs */
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const packages = path.resolve(root, 'packages');

const workspaces = fs
  .readdirSync(packages)
  .map((p) => path.join(packages, p))
  .filter(
    (p) =>
      fs.statSync(p).isDirectory() &&
      fs.existsSync(path.join(p, 'package.json'))
  );

workspaces.forEach((it) => {
  const pak = JSON.parse(
    fs.readFileSync(path.join(it, 'package.json'), 'utf8')
  );
  const file = path.join(it, 'src', 'version.ts');
  console.log(
    `📝 Generate the ${pak.name}@${pak.version} version file: ${file}`
  );
  const content = `// This file is generated automatically. Please do not edit it manually. If necessary, you can run the 'scripts/generate-version.js' script to generate it again.\n
const VERSION = '${pak.version}';
export default VERSION;
`;
  fs.writeFileSync(file, content, 'utf-8');
});
