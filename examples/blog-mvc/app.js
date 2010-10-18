var
  fs = require('fs'),
  path = require('path'),
  connect = require('connect'),
  Script = process.binding('evals').Script,
  datastore = require('./datastore');
  meryl = require('../../index');

var controllersDir = 'controllers';
var viewsDir = 'views';
var staticDir = 'public';

datastore.load(function() {

  // Register plugins
  meryl.plug(connect.staticProvider({root: staticDir}), connect.logger())

  // Loads controllers automatically
  var loadControllers = function (controllerDir, onLoad) {
    fs.readdir(controllerDir, function (err, filenames) {
      if (err) throw err;
      var filesRead = 0;
      filenames.forEach(function (filename) {
        fs.readFile(path.join(controllerDir, filename), function (err, data) {
          eval(data.toString());
          console.log("'" + filename + "' controller loaded.");
          if (filenames.length === ++filesRead) {
            onLoad();
          }
        });
      });  
    });  
  }

  // Run Meryl once controllers loaded
  loadControllers(controllersDir, function() {
    meryl.run({templateDir: viewsDir});
    console.log('listening...');
  });

});
