var gulp = require('gulp'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
postcss = require('gulp-postcss'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano'),
precss = require('precss'),
stylelint = require('stylelint'),
config = require('./stylelint.config.js'),
gutil = require('gutil'),
uglify = require('gulp-uglify'),
retinize = require('gulp-retinize'),
fontmin = require('gulp-fontmin'),
htmlImport = require('gulp-html-import');

// server connect
gulp.task('connect', function () {
	connect.server({
		root: './', //path to project
		livereload: true,
	});
});

// styles
gulp.task('styles', function () {
	var processors = [
	stylelint(config),
		cssnano,
		precss
		];
		return gulp.src('src/styles/main.pcss')
		.pipe(postcss(processors).on('error', function (err) {
			gutil.log(err);
			this.emit('end');
		}))
		.pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
		.pipe(sourcemaps.write('.'))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
	});

var retinizeOpts = {
	/// Your options here.
};

// html
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(htmlImport('src/').on('error', function (err) {
			gutil.log(err);
			this.emit('end');
		}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

function swallowError(error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}

gulp.on('err', function(err){
  console.log(err);
});

// copy image and video on task dev
gulp.task('copy', function() {
	gulp.src('src/favicon/**/*').pipe(gulp.dest('dist/favicon'));
	gulp.src('src/video/*').pipe(gulp.dest('dist/video'));
	gulp.src('src/img/*').pipe(gulp.dest('dist/img'));
	gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
});

// imagemin
gulp.task('compressor', function () {
	gulp.src('src/favicon/**/*').pipe(gulp.dest('dist/favicon'));
	gulp.src('src/video/*').pipe(gulp.dest('dist/video'));

	return gulp.src('src/img/**/*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(retinize(retinizeOpts))
	.pipe(gulp.dest('dist/img/'))
	.pipe(connect.reload());
});

// minfy js
gulp.task('js', function () {
	return gulp.src(['src/js/**/*'])
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
	});

// watch
gulp.task('watch', function () {
	gulp.watch('src/styles/**/*.pcss', ['styles']);
	gulp.watch('src/img/**/*', ['copy']);
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['html', 'styles', 'compressor', 'js']);
gulp.task('dev', ['connect', 'html', 'styles', 'copy', 'js', 'watch']);