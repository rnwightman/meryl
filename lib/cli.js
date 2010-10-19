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
