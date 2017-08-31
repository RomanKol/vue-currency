const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const pug = require('gulp-pug');

const eslint = require('gulp-eslint');

function reportError(error) {
    console.log(error);
    this.emit('end');
}

// Eslinting task
gulp.task('lint', () => gulp.src('./src/js/*.js')
    .pipe(eslint({
        fix: true,
    }))
    .pipe(eslint.format())
    .pipe(gulp.dest('./app/js/')));

// Pug rendering task
gulp.task('pug', () => gulp.src('./src/pug/*.pug')
    .pipe(pug({
        pretty: true,
    }))
    .on('error', reportError)
    .pipe(gulp.dest('./app/')));

// Watch Task
gulp.task('watch', () => {
    browserSync.init({
        open: false,
        notify: false,
        server: {
            baseDir: './app/',
        },
        port: 8080,
    });

    gulp.watch('./src/pug/**', ['pug', reload]);
    gulp.watch('./src/js/**', ['lint', reload]);
});

// Default/Dev Task
gulp.task('default', ['watch', 'pug', 'lint']);
