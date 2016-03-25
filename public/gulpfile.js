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

gulp.task('bower', () => {
	return gulp.src('bower_components/**/*')
		.pipe(gulp.dest('target/bower_components'));
});

gulp.task('watch', () => {
	gulp.watch('bower_components/**/*', gulp.series('bower'));
	gulp.watch('app/**/*.less', gulp.series('less'));
	gulp.watch('app/**/*.js', gulp.series('javascript'));
});

gulp.task('build-dev', gulp.series('clean', gulp.parallel('bower', 'html', 'javascript', 'less', 'watch')));

gulp.task('default', gulp.series('build-dev'));