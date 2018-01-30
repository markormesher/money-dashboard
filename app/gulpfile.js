const fs = require('fs');
const path = require('path');
const glob = require('glob');
const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify-es').default;
const streamify = require('gulp-streamify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

const staticAssetsInput = 'src/assets/**/*';
const staticAssetsOutput = 'dist/assets';
const staticViewsInput = 'src/views/**/*';
const staticViewsOutput = 'dist/views';
const tsAssets = 'dist/public';
const tsConfig = 'tsconfig.json';
const distOutput = 'dist';

function getFolders(dir) {
	return fs.readdirSync(dir)
			.filter(function (file) {
				return fs.statSync(path.join(dir, file)).isDirectory();
			});
}

gulp.task('clean', function () {
	return gulp.src(distOutput, {read: false}).pipe(clean());
});

gulp.task('compile-ts', ['clean'], function () {
	const tsProject = ts.createProject(tsConfig);
	return tsProject.src()
			.pipe(tsProject())
			.js.pipe(gulp.dest(distOutput));
});

gulp.task('static-assets', ['compile-ts'], function () {
	return gulp.src(staticAssetsInput).pipe(gulp.dest(staticAssetsOutput));
});

gulp.task('static-views', ['compile-ts'], function () {
	return gulp.src(staticViewsInput).pipe(gulp.dest(staticViewsOutput));
});

gulp.task('ts-assets', ['compile-ts'], function () {
	const folders = getFolders(tsAssets);

	return folders.map(function (folder) {
		const inputFileGlob = path.join(tsAssets, folder, '**/*.js');
		const inputFiles = glob.sync(inputFileGlob);

		const outputFilePath = path.join(tsAssets, folder);
		const outputFile = path.join(tsAssets, folder, 'bundle.js');

		const bundleStream = browserify({entries: inputFiles}).bundle();
		return bundleStream
				.pipe(source(outputFile))
				.pipe(rename('bundle.js'))
				.pipe(streamify(sourcemaps.init()))
				.pipe(streamify(uglify()))
				.pipe(streamify(sourcemaps.write()))
				.pipe(gulp.dest(outputFilePath));
	});
});

gulp.task('default', ['clean', 'compile-ts', 'static-assets', 'static-views', 'ts-assets']);
