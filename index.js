'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const through = require('through2');
const PluginError = require('plugin-error');
const File = require('vinyl');


module.exports = function (filename, staticDir) {
  if (!filename) {
    throw new PluginError('gulp-markdown-index', '`filename` required');
  }

  let firstFile, list = [];

  return through.obj((file, enc, callback) => {
      if (file.isNull()) {
        return callback(null, file);
      }
      if (!firstFile) {
        firstFile = file;
      }
      list.push({
        "path": file.path,
        "mtime": file.stat.mtimeMs
      });

        callback();
  }, function (cb) {
    if (!firstFile) {
      cb();
      return;
    }

    // the build json file and the markdown file must in the same staticDir
    if(!staticDir){
      staticDir = '';
      let firstPathList = firstFile.path.split(path.sep);
      let filePathList = path.resolve(filename).split(path.sep);
      for(let i = 0; i < firstPathList.length; i++){
        if(firstPathList[i] == filePathList[i]){
          staticDir += firstPathList[i] + path.sep;
        }else{
          break;
        }
      }
    }
    list = list.map((o) => {
      o.path = path.relative(staticDir, o.path);
      return o;
    });

    this.push(new File({
      path: filename,
      contents: new Buffer(JSON.stringify(list, null, 1))
    }));

    cb();
    console.log('It\'s saved to ' + filename );

  }
  );
};
