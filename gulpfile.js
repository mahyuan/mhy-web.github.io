var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

gulp.task('minify-css', function () {
	return gulp.src('./public/**/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./public'));
});

gulp.task('minify-html', function () {
	return gulp.src('./public/**/*.html')
		.pipe(htmlclean())
		.pipe(htmlmin({
			removeComments: true,
			minifyJS: true,
			minifyCSS: true,
			minifyURLs: true,
		}))
		.pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function () {
	return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./public'));
});

// 压缩图片
gulp.task('minify-images', function () {
	return gulp.src('./public/images/**/*.*')
		.pipe(imagemin(
			[imagemin.gifsicle({
					'optimizationLevel': 3
				}),
				imagemin.jpegtran({
					'progressive': true
				}),
				imagemin.optipng({
					'optimizationLevel': 7
				}),
				imagemin.svgo()
			], {
				'verbose': true
			}))
		.pipe(gulp.dest('./public/images'))
});

gulp.task('default', ['minify-html', 'minify-css', 'minify-js']);
