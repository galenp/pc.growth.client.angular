var gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    ngAnnotate = require('gulp-ng-annotate'),
    jscs = require('gulp-jscs'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    bowerFile = require('./bower.json');

var src = {
    js: ['src/*.js'],
    bower: ['bower.json']
}

var distdir = 'dist';

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');



function buildJS() {
    return gulp.src(src.js)
        .pipe(plumber())
        //JsCs
        .pipe(jscs())
        //Header
        .pipe(header(banner, {
            pkg: bowerFile
        }))
        //Output
        .pipe(gulp.dest(distdir));
}

gulp.task('js', buildJS);
gulp.task('watch', function() {
    gulp.watch(src.js, ['js'])
});


gulp.task('compress-js', ['js'], function() {
    return gulp.src([distdir + '/*.js', '!**/*.min.js'])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distdir))
});

gulp.task('package'. ['build'])


gulp.task('bower', ['js']);
gulp.task('compress', ['compress-js']);

gulp.task('default', ['bower']);
gulp.task('build', ['bower', 'compress']);
