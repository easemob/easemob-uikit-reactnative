const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '../../..');
const packages = path.resolve(root, 'packages');

const workspaces = fs
  .readdirSync(packages)
  .map((p) => path.join(packages, p))
  .filter(
    (p) =>
      fs.statSync(p).isDirectory() &&
      fs.existsSync(path.join(p, 'package.json'))
  );

const kvs = workspaces.map((it) => {
  const pak = JSON.parse(
    fs.readFileSync(path.join(it, 'package.json'), 'utf8')
  );
  return { [pak.name]: path.join(it, pak.source) };
});

const kvs2 = workspaces.map((it) => {
  const pak = JSON.parse(
    fs.readFileSync(path.join(it, 'package.json'), 'utf8')
  );
  return { [pak.name]: { root: it } };
});

// Get the list of dependencies for all packages in the monorepo
const modules = []
  .concat(
    ...workspaces.map((it) => {
      const pak = JSON.parse(
        fs.readFileSync(path.join(it, 'package.json'), 'utf8')
      );

      // We need to make sure that only one version is loaded for peerDependencies
      // So we exclude them at the root, and alias them to the versions in example's node_modules
      return pak.peerDependencies ? Object.keys(pak.peerDependencies) : [];
    })
  )
  .sort()
  .filter(
    (m, i, self) =>
      // Remove duplicates and package names of the packages in the monorepo
      self.lastIndexOf(m) === i && !m.startsWith('@react-navigation/')
  );

module.exports = {
  root: root,
  workspaces: workspaces,
  kvs: kvs,
  kvs2: kvs2,
  modules: modules,
};
