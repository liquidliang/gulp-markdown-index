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
    // Do nothing if no contents
    if (file.isNull()) {
      this.emit("error", new PluginError('gulp-markdown-index', "File is null"));
      this.emit("end");
      return callback(null, file);
    }

      if (!firstFile) {
        firstFile = file;
      }
      list.push({
        "path": file.path,
        "mtime": file.stat && file.stat.mtimeMs || Date.now()
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
    if (firstFile.path.indexOf(staticDir) == -1) {
      throw new Error(`[gulp-markdown-index] The staticDir is ${staticDir}, but markdown file ${firstFile.path} is not in the static directory`);
    }
    let directoryDict = {};
    list = list.map((o) => {
      o.path = path.relative(staticDir, o.path);
      let dirName = path.dirname(o.path);
      if(/\w+\/\w+$/.test(dirName)){
        if(!directoryDict[dirName]){
          directoryDict[dirName] = {
            path: dirName.replace(path.sep, '/'),
            mtime: o.mtime,
            isDirectory: 1,
            num: 1
          }
        }else{
          directoryDict[dirName].num++;
          directoryDict[dirName].mtime = Math.max(directoryDict[dirName].mtime, o.mtime);
        }
      }
      return {
        path: o.path.replace(path.sep, '/'),
        mtime: o.mtime
      };
    });

    for(let key in directoryDict){
      list.push(directoryDict[key]);
    }

    this.push(new File({
      path: filename,
      contents: new Buffer(JSON.stringify(list, null, 1))
    }));

    cb();
    console.log('It\'s saved to ' + filename );

  }
  );
};
