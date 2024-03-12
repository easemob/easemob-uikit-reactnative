#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const project_root = path.resolve(__dirname, '..');

const pak = JSON.parse(
  fs.readFileSync(path.join(project_root, 'package.json'), 'utf8')
);
const file = path.join(project_root, 'src', 'env.ts');
console.log(`📝 Generate the ${pak.name}@${pak.version} env file: ${file}`);
const content = `export const test = true;
export const appKey = '';
export const id = '';
export const ps = '';
export const accountType = ''; // agora or easemob
export const agoraAppId = '';
export const fcmSenderId = '';
`;
fs.writeFileSync(file, content, 'utf-8');
