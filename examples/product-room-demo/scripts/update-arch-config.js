const fs = require('fs');
const path = require('path');

const { color_log } = require('./utils');

// Read app.json configuration
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Get the newArchEnabled value from app.json
const newArchEnabled =
  appConfig.expo.newArchEnabled === true ? 'true' : 'false';

// Get the jsEngine value from app.json
const useHermes = appConfig.expo.jsEngine === 'hermes' ? 'true' : 'false';

// Update iOS configuration (Podfile.properties.json)
const iosPodfilePropsPath = path.join(
  __dirname,
  '..',
  'ios',
  'Podfile.properties.json'
);
const iosPodfileProps = JSON.parse(
  fs.readFileSync(iosPodfilePropsPath, 'utf8')
);
iosPodfileProps.newArchEnabled = newArchEnabled;
iosPodfileProps['expo.jsEngine'] = appConfig.expo.jsEngine || 'hermes';
fs.writeFileSync(iosPodfilePropsPath, JSON.stringify(iosPodfileProps, null, 2));

// Update Android configuration (gradle.properties)
const androidGradlePropsPath = path.join(
  __dirname,
  '..',
  'android',
  'gradle.properties'
);
let androidGradleProps = fs.readFileSync(androidGradlePropsPath, 'utf8');

// Replace newArchEnabled property
androidGradleProps = androidGradleProps.replace(
  /newArchEnabled=(true|false)/,
  `newArchEnabled=${newArchEnabled}`
);

// Replace hermesEnabled property
androidGradleProps = androidGradleProps.replace(
  /hermesEnabled=(true|false)/,
  `hermesEnabled=${useHermes}`
);

fs.writeFileSync(androidGradlePropsPath, androidGradleProps);

color_log.success(
  `Updated Android gradle.properties, newArchEnabled: ${newArchEnabled}, hermesEnabled: ${useHermes}`
);
