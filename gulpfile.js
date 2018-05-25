let gulp = require('gulp');
let minifycss = require('gulp-minify-css');
let uglify = require('gulp-uglify');
let htmlmin = require('gulp-htmlmin');
let htmlclean = require('gulp-htmlclean');
let imagemin = require('gulp-imagemin');
// let clean = require('gulp-clean');
// let shell = require('gulp-shell');

gulp.task('html', function() {
	let options = {
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
		.pipe(htmlclean())
		.pipe(htmlmin(options))
		.on('error', function(err) {
			console.error('html error!', err);
			this.end();
		})
		.pipe(gulp.dest('./public'))
});

gulp.task('js', function() {
	gulp.src('./public/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./public'));
});

gulp.task('images', function() {
	gulp.src('./public/img/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('./public/img'));
});

gulp.task('css', function() {
	gulp.src('./public/**/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./public'))
});

// CSS 文件已压缩，需要压缩的有html、js和图片
const taskList = [
	'html',
	'css',
	'js',
	'images'
	];

gulp.task('build', taskList);

