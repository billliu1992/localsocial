var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var del = require('del');

gulp.task('clean', () => {
	return del([
			'target/**/*'
		]);
});

gulp.task('html', () => {
	return gulp.src('app/**/*.html')
		.pipe(gulp.dest('target/'));
});

gulp.task('javascript', () => {
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

gulp.task('less', () => {
	return gulp.src('app/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('target/'));
});

gulp.task('build-dev', ['clean', 'html', 'javascript', 'less']);

gulp.task('default', ['build-dev']);