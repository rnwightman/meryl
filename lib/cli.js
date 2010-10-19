/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var meryl = require('./meryl'),
  path = require('path');

/**
 * Import options
 */

var options = null;

// TODO: Handle config file location as a cli arg to load from an arbitrary path

try {
  options = require(path.join(process.cwd(), "config"));
  if (options)
    console.log('Config loaded...');

} catch (e) {
  // Skip exception
  // TODO: Inform user for config file's internal errors
}

/**
 * Start Engines
 */
meryl.run(options);

console.log('Running Meryl...');
