#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { root_dir, current_dir, color_log } = require('./utils');

const templates_dir = path.join(root_dir, 'templates');

const files = [
  {
    template: path.join(templates_dir, 'GoogleService-Info.plist.template'),
    target: path.join(current_dir, 'GoogleService-Info.plist'),
  },
  {
    template: path.join(templates_dir, 'google-services.json.template'),
    target: path.join(current_dir, 'google-services.json'),
  },
];

color_log.info('[Firebase] Checking Firebase config files...');

for (const { template, target } of files) {
  const name = path.basename(target);
  if (fs.existsSync(target)) {
    color_log.warning(`  ${name} already exists, skipping.`);
    continue;
  }
  if (!fs.existsSync(template)) {
    color_log.error(`  Template not found: ${template}`);
    continue;
  }
  fs.copyFileSync(template, target);
  color_log.success(`  Copied template -> ${name}`);
}
