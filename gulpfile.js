var gulp = require('gulp');

var cssver = require('gulp-make-css-url-version')
var debug = require('gulp-debug');
var rev = require('gulp-rev-append');




gulp.task('rev', function() {
  gulp.src('app/*.html')
    .pipe(rev())
    .pipe(gulp.dest('app'));
});
gulp.task('css',function(){
            gulp.src('app/*/*.css')
                .pipe(debug())
                .pipe(cssver())
                .pipe(gulp.dest('output'))
        });
