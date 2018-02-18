
// var cssnext = require('cssnext');
// for gulp and vueify
module.exports = {
  // configure a built-in compiler 
  less: {
  	
  },
  // provide your own postcss plugins 
  postcss: [],
  // register custom compilers 
  customCompilers: {
    // for tags with lang="ts" 
    ts: function (content, cb, compiler, filePath) {
      // content:  content extracted from lang="ts" blocks 
      // cb:       the callback to call when you're done compiling 
      // compiler: the vueify compiler instance 
      // filePath: the path for the file being compiled 
      // 
      // compile some TypeScript... and when you're done: 
      cb(null, result)
    }
  }
}