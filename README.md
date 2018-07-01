# gulp-markdown-index
===========

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]

> A create the markdown index plugin for gulp

## Usage

First, install `gulp-markdown-index` as a development dependency:

```shell
npm install --save-dev gulp-markdown-index
```

Then, add it to your `gulpfile.js`:

### Simple
```javascript
var indexer = require('gulp-markdown-index');

gulp.task('indexer', function(){
  return gulp.src('./public/**/*.md')
    .pipe(indexer('./public/json/article.json'))
    .pipe(gulp.dest('./'));
});
```
