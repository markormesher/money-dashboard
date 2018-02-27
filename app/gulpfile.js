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

const tsAssets = 'dist/public';
const tsConfig = 'tsconfig.json';
const distOutput = 'dist';

function getFolders(dir) {
	var folders = [];
	fs.readdirSync(dir).filter(function (file) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			folders.push(fullPath);
			const subFolders = getFolders(fullPath);
			folders = folders.concat(subFolders);
		}
	});
	return folders;
}

gulp.task('clean', function () {
	return gulp.src(distOutput, {read: false}).pipe(clean());
});

gulp.task('compile-ts', function () {
	const tsProject = ts.createProject(tsConfig);
	return tsProject.src()
			.pipe(tsProject())
			.js.pipe(gulp.dest(distOutput));
});

gulp.task('ts-assets', ['compile-ts'], function () {
	const folders = getFolders(tsAssets);

	return folders.map(function (folder) {
		const inputFileGlob = path.join(folder, '*.js');
		const inputFiles = glob.sync(inputFileGlob);
		const outputFile = path.join(folder, 'bundle.js');

		const bundleStream = browserify({entries: inputFiles}).bundle();
		return bundleStream
				.pipe(source(outputFile))
				.pipe(rename('bundle.js'))
				.pipe(streamify(sourcemaps.init()))
				.pipe(streamify(uglify()))
				.pipe(streamify(sourcemaps.write()))
				.pipe(gulp.dest(folder));
	});
});

gulp.task('default', ['compile-ts', 'ts-assets']);
