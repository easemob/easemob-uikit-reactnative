#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const { current_dir, current_package, color_log } = require('./utils');

const out_file = path.join(current_dir, 'src', 'version.ts');
color_log.success(
  `📝 Generate the ${current_package.name}@${current_package.version} version file: ${out_file}`
);
const content = `// This file is generated automatically. Please do not edit it manually. If necessary, you can run the 'scripts/generate-version.js' script to generate it again.\n
const VERSION = '${current_package.version}';
export default VERSION;
`;
fs.writeFileSync(out_file, content, 'utf-8');
