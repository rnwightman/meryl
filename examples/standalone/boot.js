var connect = require('connect');

// Boot file

// export a function accepting Meryl instance
module.exports = function (meryl) {
  
  meryl.plug(connect.staticProvider(), connect.logger());
  
  meryl.options = {
    templateExt: '.mt', // Default is '.jshtml'
    port: 3000 // Already the default one
  };
};
