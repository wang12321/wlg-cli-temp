var gulp = require('gulp');
const uglify = require('gulp-uglify');
var bump = require('gulp-bump');

gulp.task('js',['bump'], function () {
    return gulp.src('./lib/*.js') // read all
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('bump',function(){
    return gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});
gulp.task('default', ['js'])
