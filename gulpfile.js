var gulp = require('gulp');
const uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('./lib/*.js') // read all
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
gulp.watch('./lib/*.js', gulp.series('default'));
