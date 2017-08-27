var gulp = require("gulp"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
    browserSync = require('browser-sync').create(),
    del = require('del'),
    useref = require('gulp-useref'), // Concate *.js files
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence');


/*=============================================
=            gulp "default"            =
=============================================*/

gulp.task("css", function(){
    return gulp.src("scss/main.scss")
        .pipe(plumber())
        .pipe(sass.sync())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest("css/"))
        .pipe(browserSync.stream());
});


gulp.task("browser-sync", function() {
    browserSync.init({
        server: "./"
    });
});


gulp.task("watch", function(){
    gulp.watch("scss/**/*.scss", ["css"]);
    gulp.watch(["*.html", "js/*.js"], browserSync.reload);
});



gulp.task("default", ["css", "browser-sync", "watch"]);

/*=====  End of gulp "default"  ======*/



/*=============================================
=            gulp "dist"            =
=============================================*/

gulp.task("clean", function(){
    return del("dist/");
});


gulp.task("concat", function () {
    return gulp.src("*.html")
        .pipe(useref())
        .pipe( gulpif ("*.js", uglify()))
        .pipe(gulp.dest("dist/"));
});


gulp.task("imagemin", function(){
    return gulp.src('dist/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});


gulp.task("copy", function(){
    return gulp.src(["css/**/*.css", "img/*"], {
        base: "src"
    })
    .pipe(gulp.dest("dist/"));
});


gulp.task("dist", function(){
    runSequence("clean", "concat", "copy", "imagemin");
});

/*=====  End of gulp "distribution"  ======*/
