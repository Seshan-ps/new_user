const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const mobileRoot = path.resolve(projectRoot, 'mobile');

const config = getDefaultConfig(mobileRoot);

// Point the project root to mobile directory
config.projectRoot = mobileRoot;

// Watch the entire workspace/root folder
config.watchFolders = [projectRoot];

// Let Metro resolve modules from both root and mobile node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(mobileRoot, 'node_modules'),
];

module.exports = config;
