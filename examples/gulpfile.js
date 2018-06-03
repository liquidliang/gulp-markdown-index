var gulp = require('gulp');
/** REMOVE ME **/ var indexer = require('../');
/** USE ME **/ // var replace = require('gulp-markdown-index');

gulp.task('index', function() {
  return gulp.src('./blog/**/*.md', { base : './' } )
    .pipe(indexer('./json/article.json'))
    .pipe(gulp.dest('./'));
});

gulp.task('public', function () {
  return gulp.src('./public/**/*.md')
    .pipe(indexer('./public/json/article2.json'))
    .pipe(gulp.dest('./'));
});
gulp.task('default', ['index', 'public']);
