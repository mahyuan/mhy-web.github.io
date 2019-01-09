var gulp = require('gulp');
var htmlInline = require('gulp-html-inline');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

gulp.task('html', function () {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};
	gulp.src('./public/**/*.html')
	.pipe(htmlInline({
		minifyJs: true
	}))
	.on('error', function (e){
		console.log(e)
	})
	// .pipe(babel({
	// 	presets: ['@babel/env']
	// }))
	.pipe(gulp.dest('./public'))
});

gulp.task('js', function() {
	gulp.src('./public/**/*.js')
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./public/script'));
});

gulp.task('images', function() {
	gulp.src('./public/images/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('./public'));
});

gulp.task('css', function() {
	gulp.src('./public/**/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./public'))
});

gulp.task('default', ['html'])
