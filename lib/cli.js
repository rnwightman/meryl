/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var meryl = require('./meryl'),
  fs = require('fs'),
  path = require('path');

/**
 * Load boot file
 */
var configDir = process.ARGV.length == 3 && process.ARGV[2];
if (configDir) {
  try {
    process.chdir(configDir);
  } catch (e) {
    throw 'Invalid config path';
  }
}

var configPath = path.join(process.cwd(), 'boot.js');

var stats = fs.statSync(configPath);
if (stats || stats.isFile()) {
  configPath = configPath.replace(/\.js$/, '');
  require(configPath)(meryl);
  console.log('Boot file loaded...');
} else {
  console.log('Boot file not found, using defaults');
}

/**
 * Start Engines
 */  
meryl.run();
console.log('Running Meryl...');
