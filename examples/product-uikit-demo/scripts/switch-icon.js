#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const { current_dir, color_log } = require('./utils');

const VALID_BRANDS = ['easemob', 'agora', 'shengwang'];

const brand = process.argv[2];

if (!brand || !VALID_BRANDS.includes(brand)) {
  color_log.error(
    `❌ Invalid brand argument: "${brand}". Must be one of: ${VALID_BRANDS.join(', ')}`
  );
  process.exit(1);
}

const appJsonPath = path.join(current_dir, 'app.json');
const iconPattern = /\.\/assets\/images\/(easemob|agora|shengwang)\.png/g;
const replacement = `./assets/images/${brand}.png`;

color_log.info(`[switch-icon]Switching icons to brand: ${brand}`);

const content = fs.readFileSync(appJsonPath, 'utf-8');
const updated = content.replace(iconPattern, replacement);

if (content === updated) {
  color_log.warning(
    '⚠️  No icon references were changed (already using this brand?).'
  );
} else {
  fs.writeFileSync(appJsonPath, updated, 'utf-8');
  color_log.success(
    `✅ Replaced icon references with ${replacement} in app.json`
  );
}
