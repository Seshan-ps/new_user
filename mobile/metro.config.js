const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Set the project root explicitly
config.projectRoot = projectRoot;

// Watch all files within the monorepo/workspace
config.watchFolders = [workspaceRoot];

// Let Metro resolve modules from the monorepo/workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
