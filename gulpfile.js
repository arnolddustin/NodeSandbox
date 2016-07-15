var gulp = require('gulp')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , at = require('gulp-asset-transform')
    , rev = require('gulp-rev')
    , minifyHtml = require('gulp-minify-html')
    , minifyCss = require('gulp-minify-css')
    , less = require('gulp-less')
    , ngAnnotate = require('gulp-ng-annotate')
    , install = require('gulp-install')
    , args   = require('yargs').argv
    ;

gulp.task('default', ['watch']);

gulp.task('build',['copy', 'install', 'usemin']);

gulp.task('copy', function(){

    gulp.src('./src/index.js')
        .pipe(gulp.dest('./build'));

    gulp.src('./src/server/**/*.js')
        .pipe(gulp.dest('./build/server'));

    gulp.src('./src/client/**/*.html')
        .pipe(gulp.dest('./build/client'));

    gulp.src('./src/client/bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('./build/client/fonts'));

    gulp.src('./src/modules/*')
        .pipe(gulp.dest('./build/modules'));

    gulp.src('./src/server/config/*.json')
        .pipe(gulp.dest('./build/config'))
})

gulp.task('install-client', function(){
    return gulp.src(['./bower.json'])
        .pipe(install());

})

gulp.task('install', function(){
    return gulp.src('./package.json')
        .pipe(gulp.dest('./build/'))
        .pipe(install({production:true}));
})

gulp.task('usemin', ['install-client'], function() {
    gulp.src('./src/client/index.html')
        .pipe(at({
            less: {
                tasks:[less(), minifyCss({processImport: false}), 'concat']
            },
            js: {
                tasks:[ngAnnotate(), uglify(), 'concat', rev()]
            }
        }))
        .pipe(gulp.dest('build/client'));
});


