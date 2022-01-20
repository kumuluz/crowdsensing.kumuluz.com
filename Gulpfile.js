var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	sass        = require('gulp-sass')(require('node-sass')),
	del         = require('del'),
	useref      = require('gulp-useref'),
	uglify      = require('gulp-uglify'),
	concat      = require('gulp-concat'),
	gulpIf      = require('gulp-if'),
	cssnano     = require('gulp-cssnano'),
	rename      = require('gulp-rename'),
	cssbeautify = require('gulp-cssbeautify'),
	pretty      = require('gulp-pretty-html'),
	twig        = require('gulp-twig'),
	prefix      = require('gulp-autoprefixer'),
	plumber     = require('gulp-plumber'),
	path        = require('path'),
	sourcemaps  = require('gulp-sourcemaps');
const runSequence = require('gulp4-run-sequence');
const fs = require('fs');


/**
* Compile .twig files and pass data from json file
* matching file name. index.twig - index.twig.json into HTMLs
*/
gulp.task('twig', function () {
   return gulp.src(['./src/*.twig'])
   // Stay live and reload on error
   .pipe(plumber({
      handleError: function (err) {
         console.log(err);
         this.emit('end');
      }
   }))
   .pipe(twig())
   .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
   })
   .pipe(pretty())
   .pipe(gulp.dest('./dist/'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
		.pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest("src/js"));
});


///////// DIST /////////

// Concatente and Uglyfy (all.min.js, all-min.css)
gulp.task('concatente', function(){
  return gulp.src('dist/*.html')
  	.pipe(useref())

    //uglyfy js files
    .pipe(gulpIf('*.js', uglify()))
    //.pipe(gulpIf('*.js', concat('combined.js')))

    //uglyfy css files
    .pipe(gulpIf('*.css', cssnano()))
    //.pipe(gulpIf('*.css', concat('combined.css')))

    .pipe(gulp.dest('dist'))
});

// Copy assets to dist
gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
  .pipe(gulp.dest('dist/assets'))
})

//CSS

// Copy original css files to dist and beautify
gulp.task('rawcss', function() {
  return gulp.src(['src/css/*.css', '!src/css/*.min.css'])
  .pipe(cssbeautify())
  .pipe(gulp.dest('dist/css'))
})

gulp.task('mincss', function() {
  return gulp.src('src/css/*.min.css')
  .pipe(gulp.dest('dist/css'))
})


// Uglyfy css
gulp.task('uglystyle', function() {
  return gulp.src(['src/css/*.css', '!src/css/*.min.css'])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/css'))
})


//JS

// Copy original js files to dist
gulp.task('rawjs', function() {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('dist/js'))
})
// Uglyfy custom.js
gulp.task('uglycustom', function() {
  return gulp.src(['src/js/*.js', '!src/js/*.min.js'])
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/js'))
})


// Delete dist folder
gulp.task('clean:dist', function() {
  return del('dist');
})


// Static Server + watching scss/html files
gulp.task('serve', gulp.series('clean:dist', 'twig', 'sass', 'assets', 'rawcss', 'mincss', 'uglystyle', 'rawjs', 'uglycustom', function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("src/assets/**/*").on('change', gulp.series('assets',browserSync.reload));
    gulp.watch("src/scss/**/*.scss").on('change', gulp.series('sass','rawcss', 'mincss', 'uglystyle',browserSync.reload));
    gulp.watch("src/**/*.twig").on('change', gulp.series('twig',browserSync.reload));
    gulp.watch("src/js/*.js").on('change', gulp.series('rawjs', 'uglycustom', browserSync.reload));

}));

gulp.task('default', gulp.parallel('js', 'serve'));

// Compile to dist
/*
gulp.task('dist', function (callback) {
  runSequence(
    'clean:dist',
    ['twig', 'assets', 'rawcss', 'mincss', 'uglystyle', 'rawjs', 'uglycustom', 'concatente'],
    callback

  );
});
*/

gulp.task('dist', gulp.series('clean:dist', 'twig', 'sass', 'assets', 'rawcss', 'mincss', 'uglystyle', 'rawjs', 'uglycustom', 'concatente'));