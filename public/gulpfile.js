var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var del = require('del');

gulp.task('clean', () => {
	return del([
			'target/**/*'
		]);
});

gulp.task('html', ['clean'], () => {
	return gulp.src('app/**/*.html')
		.pipe(gulp.dest('target/'));
});

gulp.task('javascript', ['clean'],  () => {
	return gulp.src('app/**/*.js')
		.pipe(babel(
			{
        		"presets": ["es2015", "react"],
        		"ignore": [
                	"bower_components"
        		]
		}))
		.pipe(gulp.dest('target/'));
});

gulp.task('less', ['clean'],  () => {
	return gulp.src('app/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('target/'));
});

gulp.task('bower', ['clean'], () => {
	return gulp.src('bower_components/**/*')
		.pipe(gulp.dest('target/bower_components'));
});

gulp.task('build-dev', ['clean', 'bower', 'html', 'javascript', 'less']);

gulp.task('default', ['build-dev']);