var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	sprity = require('sprity'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	sass   = require('gulp-ruby-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber    = require('gulp-plumber');

    input  = {
      'sass': 'resources/scss/**/*.scss',
      'javascript': 'resources/js/**/*.js',
      'vendorjs': 'resources/js/vendor/**/*.js',
      'images': 'resources/img/*.*',
      'svgs': 'resources/svg/*.*',
      'fonts': 'resources/fonts/*.*'
    },

    output = {
      'stylesheets': 'public/css',
      'images': 'public/img',
      'javascript': 'public/js',
      'fonts': 'public/fonts'
    };

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['watch']);

/* Run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* Compile scss files */
gulp.task('build-css', function() {
    return sass('resources/scss', { style: 'expanded' })
        .on('error', function(err) {
            //beeper('*-*--****');
            console.log(err.message);
        })
        .pipe(plumber())
        .pipe(gulp.dest(output.stylesheets))
});

/* Concat javascript files and minify */
gulp.task('build-js', function() {
  return gulp.src(input.javascript)
    .pipe(uglify()) 
    .pipe(gulp.dest(output.javascript));
});

/* Watch these files for changes and run the task on update */
gulp.task('watch', function() {
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  gulp.watch(input.sass, ['build-css']);
  gulp.watch('./resources/img/sprites/**/*.{png,jpg}', ['sprites']);
  gulp.watch(input.images, ['copy']);
  gulp.watch(input.fonts, ['copy']);
});

gulp.task('copy', function() {
    gulp.src(input.images)
        .pipe(gulp.dest(output.images))
    gulp.src(input.svgs)
        .pipe(gulp.dest(output.images))
    gulp.src(input.fonts)
        .pipe(gulp.dest(output.fonts))        
});

/* Generate sprite.png and _sprite.scss */
gulp.task('sprites', function () {
  return sprity.src({
    src: './resources/img/sprites/**/*.{png,jpg}',
    style: './_sprite.scss',
    'style-type': 'scss',
    retina:false,
    prefix: 'sprite',
    cssPath: '../img/',
    'dimension': [{
      ratio: 1, dpi: 72
    }],
    processor: 'sass',
    split: true,
    cachebuster: true
  })
  .pipe(gulpif('*.png', gulp.dest('./public/img/'), gulp.dest('./resources/scss/')))
});