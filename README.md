# gulp-markdown-index

create the markdown index.



## Running the example

Type the following commands from the root of this repository:

```
npm install # install the plugin's dependencies
cd examples/inplace
npm install # install the example's dependencies
gulp
```
You should find two article.json files has been created



# gulp-markdown-index [![NPM version][npm-image]][npm-url]
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
