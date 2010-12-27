var meryl = require('../../index'),
fs = require('fs'),
path = require('path'),
dust = require('dust');

var opts = {
   templateDir: 'templates',
   templateExt: '.html',
   compileTemplateFunc: dust.compile,
   loadTemplateFunc: dust.loadSource,
   renderTemplateFunc: dust.render,
   port: 3000,
   hostname: 'localhost'  
};

var dataStore = {
   posts: [
   {
      key:1,
      title:"post 1",
      date: "01/19/10"
   },
   {
      key:2,
      title:"post 2",
      date: "01/14/10",
      content: "This is the post 2"
   },
   {
      key:3,
      title:"post 3",
      date: "04/2/10",
      content: "This is the post 3"      
   }
   ]
};

var prepareTemplates = function(opts, onLoad) {
   fs.readdir(opts.templateDir, function (err, filenames) {
      if (err) {
         throw err;
      }
      var filesRead = 0, templateName, pattern = new RegExp('\\' + opts.templateExt + '$');
      filenames.forEach(function (filename) {
         if (pattern.test(filename)) {
            fs.readFile(path.join(opts.templateDir, filename), function (err, data) {
               if (err) {
                  throw err;
               }
               templateName = filename.replace(pattern, '');
               opts.loadTemplateFunc(opts.compileTemplateFunc(data.toString(), templateName));
               console.log(templateName + ' template prepared.');
               filesRead += 1;
               if (filenames.length === filesRead) {
                  onLoad();
               }
            });
         }
      });
   });
};

prepareTemplates(opts,  function () {
   console.log('Finished preparing templates.');
});

meryl
   .h('GET /', function (req, resp) {
      resp.renderTemplate('main', dataStore);
   }
   )
   .run(opts);

console.log('listening...');