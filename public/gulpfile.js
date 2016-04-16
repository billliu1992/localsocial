var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var requirejsOptimize = require('gulp-requirejs-optimize');
var template = require('gulp-template');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var del = require('del');

var TARGET_DIR = 'target/';
var TEMP_DIR = '.tmp/';
var SOURCE_DIR = 'app/';

gulp.task('clean', () => {
	return del([
			TARGET_DIR + '**/*',
			TEMP_DIR + '**/*'
		]);
});

gulp.task('bower', () => {
	return gulp.src('bower_components/**/*')
		.pipe(gulp.dest(TEMP_DIR + 'bower_components'))
		.pipe(gulp.dest(TARGET_DIR + 'bower_components'));
});

/*
--- HTML Tasks

Dynamically include either minified or non minified resources
*/
var htmlTemplate = function(stage) {
	return () => {
		var templateData = {
			devStart : '<!--',
			devEnd : '-->',
			prdStart : '<!--',
			prdEnd : '-->'
		};
		templateData[stage + 'Start'] = '';
		templateData[stage + 'End'] = '';

		return gulp.src(SOURCE_DIR + '**/*.html')
			.pipe(template(templateData))
			.pipe(gulp.dest(TARGET_DIR));
	};
};
gulp.task('html-dev', htmlTemplate('dev'));
gulp.task('html-prd', htmlTemplate('prd'));

/*
--- Javascript tasks

Compile Javascript using Babel
For PRD, use r.js with gulp-requirejs-optimize to minify all Javascript files into one file
*/
gulp.task('javascript', () => {
	return gulp.src(SOURCE_DIR + '**/*.js')
		.pipe(babel(
			{
        		"presets": ["es2015", "react"],
        		"ignore": [
                	"bower_components"
        		]
		}))
		.pipe(gulp.dest(TEMP_DIR));
});
gulp.task('javascript-dev', () => {
	return gulp.src(TEMP_DIR + '**/*.js')
		.pipe(gulp.dest(TARGET_DIR));
});
gulp.task('javascript-prd', () => {
	return gulp.src([TEMP_DIR + 'home.js', TEMP_DIR + 'index.js'])
		.pipe(requirejsOptimize(function(file) {
			return {
				paths : {
					'axios' : 'bower_components/axios/dist/axios',
					'react' : 'bower_components/react/react',
					'react-dom' : 'bower_components/react/react-dom',
					'babel-polyfill' : 'bower_components/babel-polyfill/browser-polyfill'
				},
				optimize: 'uglify2'
			};
		}))
		.pipe(gzip({ append : true }))
		.pipe(gulp.dest(TARGET_DIR));
});
var BUILD_JAVASCRIPT_DEV = gulp.series('javascript', 'bower', 'javascript-dev');

/*
--- CSS tasks

Preprocess CSS using LESS.js
For PRD, minify and concat into one file
*/
var buildCSS = function(stage) {
	return () => {
		var pipeline = gulp.src(SOURCE_DIR + '**/*.less')
			.pipe(less());

		if(stage !== 'dev') {
			pipeline
				.pipe(cleanCSS())
				.pipe(concat('hapnen.min.css'))
				.pipe(gzip({ append : true }))
				.pipe(gulp.dest(TARGET_DIR));
		}
		else {
			pipeline
				.pipe(gulp.dest(TARGET_DIR));
		}
		return pipeline;
	};
};
gulp.task('less-dev', buildCSS('dev'));
gulp.task('less-prd', buildCSS('prd'));
/*
--- Watch tasks
*/

gulp.task('watch', () => {
	gulp.watch('bower_components/**/*', gulp.series('bower'));
	gulp.watch(SOURCE_DIR + '**/*.html', gulp.series('html-dev'));
	gulp.watch(SOURCE_DIR + '**/*.less', gulp.series('less-dev'));
	gulp.watch(SOURCE_DIR + '**/*.js', BUILD_JAVASCRIPT_DEV);
});

/*
--- Build tasks
*/
gulp.task('build-dev', gulp.series('clean',
	gulp.parallel('bower', 'html-dev', BUILD_JAVASCRIPT_DEV, 'less-dev', 'watch')));

gulp.task('build-prd', gulp.series('clean',
	gulp.parallel('bower', 'html-prd',
		gulp.series('javascript', 'bower', 'javascript-prd'),
	'less-prd')));

gulp.task('default', gulp.series('build-dev'));