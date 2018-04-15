const gulp 			= require('gulp'),
      htmlmin 		= require('gulp-htmlmin'),
      cssnano       = require('gulp-cssnano'),
	  sass 			= require('gulp-sass'),
	  autoprefixer 	= require('gulp-autoprefixer'),
	  sourcemaps 	= require('gulp-sourcemaps'),
	  browserify 	= require('gulp-browserify'),
	  buffer 		= require('vinyl-buffer'),
	  uglify 		= require('gulp-uglify'),
	  eslint 		= require('gulp-eslint'),
	  rename 		= require('gulp-rename'),
	  image 		= require('gulp-image'),
      runSequence   = require('run-sequence'),
	  del 	        = require('del'),
	  browserSync 	= require('browser-sync').create(),
	  browsers		= 'last 50 versions';

// task
const tasks = {
    default: 'default',
    clean: 'clean:dist',
	html: 'htmlmin',
	directive: 'directive',
	images: 'imagemin',
	fonts: 'fonts',
	videos: 'videos',
	css: 'cssnano',
	sass: 'sass',
	javascript: 'babelify',
	eslint: 'eslint',
	watch: 'watch'
}

// source files
const inputPath = {
	html: 'src/views/*.html',
	directive: 'src/app/**/**/**/**/*.html',
	images: 'src/assets/images/*',
	fonts: 'src/assets/fonts/*',
	videos: 'src/assets/videos/*',
	css: 'src/assets/css/*.css',
	sass: 'src/assets/sass/**/*.scss',
    javascript: 'src/app/app.js',
	eslint: 'src/app/**/**/**/**/*.js',
}

const outputPath = {
	html: 'dist',
	directive: 'dist/directive',
	images: 'dist/images',
	fonts: 'dist/fonts',
	videos: 'dist/videos',
	css: 'dist/css/vendors',
	sass: 'dist/css',
	javascript: 'dist/js',
}

const watchPath = {
    html: 'src/views/*.html',
    directive: 'src/app/**/**/**/**/*.html',
	sass: 'src/assets/sass/**/*.scss',
	javascript: 'src/app/**/**/**/**/*.js',
	eslint: 'src/app/**/**/**/**/*.js'
}

// automatic minifying html
gulp.task(tasks.html, () => {
	return gulp.src(inputPath.html)
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(outputPath.html));
});

// directive
gulp.task(tasks.directive, () => {
	return gulp.src(inputPath.directive)
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(outputPath.directive));
});

// minify images
gulp.task(tasks.images, () => {
	gulp.src(inputPath.images)
		.pipe(image())
		.pipe(gulp.dest(outputPath.images))
});

// fonts
gulp.task(tasks.fonts, () => {
	gulp.src(inputPath.fonts)
		.pipe(gulp.dest(outputPath.fonts))
});

// videos
gulp.task(tasks.videos, () => {
	gulp.src(inputPath.videos)
		.pipe(gulp.dest(outputPath.videos))
});

// css
gulp.task(tasks.css, () => {
    gulp.src(inputPath.css)
        .pipe(cssnano())
        .pipe(rename( (path) => {
            path.basename += '.min';
        }))
		.pipe(gulp.dest(outputPath.css))
});

// compile sass
// automatic browser prefixing
gulp.task(tasks.sass, () => {
	return gulp.src(inputPath.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(autoprefixer({browsers}))
		.pipe(sourcemaps.write())
		.pipe(rename( (path) => {
			path.basename += '.min';
		}))
		.pipe(gulp.dest(outputPath.sass))
});

// babelify
gulp.task(tasks.javascript, () => {
	if (process.env.NODE_ENV === 'production') {
		return gulp.src(inputPath.javascript)
			.pipe(browserify({
				transform: ['babelify', 'browserify-ngannotate']
			}).on('error', console.error.bind(console)))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(rename((path) => {
				path.basename += '.bundle';
			}))
			.pipe(gulp.dest(outputPath.javascript))
	} else {
		return gulp.src(inputPath.javascript)
			.pipe(browserify({
				insertGlobals: true,
				debug: true,
				transform: ['babelify', 'browserify-ngannotate']
			}).on('error', console.error.bind(console)))
			.pipe(rename((path) => {
				path.basename += '.bundle';
			}))
			.pipe(gulp.dest(outputPath.javascript))
	}
});

// eslint
gulp.task(tasks.eslint, () => {
	return gulp.src([inputPath.eslint, '!node_modules/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// watch
gulp.task(tasks.watch, () => {
	browserSync.init({
		server: {
            baseDir: './dist',
            routes: {
                "/node_modules": "node_modules"
            }
        },
	});
	gulp.watch(watchPath.html, [tasks.html]).on('change', browserSync.reload);
	gulp.watch(watchPath.directive, [tasks.directive]).on('change', browserSync.reload);
	gulp.watch(watchPath.sass, [tasks.sass]).on('change', browserSync.reload);
	gulp.watch(watchPath.javascript, [tasks.javascript, tasks.eslint]).on('change', browserSync.reload);
});

gulp.task(tasks.clean, () => {
    return del.sync('dist');
})

gulp.task(tasks.default, (callback) => {
	if (process.env.NODE_ENV === 'production') {
		runSequence(tasks.clean,
			[
				tasks.html,
				tasks.directive,
				tasks.images,
				tasks.fonts,
				tasks.videos,
				tasks.css,
				tasks.sass,
				tasks.javascript
			],
			callback
		)
	} else {
		runSequence(tasks.watch, callback)
	}
})
