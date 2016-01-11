var gulp    = require("gulp"),
    gutil = require('gulp-util'),
    watch   = require("gulp-watch"),
    clean   = require("gulp-clean"),
    connect = require("gulp-connect"),
    changed = require("gulp-changed"),
    bower   = require("gulp-bower"),
    // compilers
    less    = require("gulp-less"), // gulp-sass is broken
    coffee  = require("gulp-coffee"),
    coffeelint  = require("gulp-coffeelint"),
    plumber = require('gulp-plumber');

var warn = function(err) { console.warn(err); };
var paths = {
  src: "./src/",
  dst: "./build/"
}

var onError = function (err) {
  gutil.beep();
  console.log(err);
};

gulp.task("default", ["bower", "build"]);

gulp.task("build", ["coffee", "less"])

gulp.task("server", ["build", "watch"], function() {
  connect.server({
    root: '.',
    port: 8000
  });
});

gulp.task("clean", function(){
  return gulp.src(paths.dst, {read: false})
    .pipe(clean());
})

gulp.task("watch", function(){
  return gulp.watch(paths.src + "**/*", ["build"]);
});

gulp.task("bower", function() {
  return bower("bower_components")
    .pipe(gulp.dest("bower_components"))
});

// compilers

// gulp.task("copy", function(){
//   return gulp.src(paths.src + "**/*.{json,png,jpg,gif,eot,svg,ttf,woff}")
//     .pipe(changed(paths.dst))
//     .pipe(gulp.dest(paths.dst))
//     .pipe(connect.reload());
// });

gulp.task("less", function(){
  return gulp.src(paths.src + "**/*.less")
    .pipe(changed(paths.dst, { extension: '.css' }))
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less().on('error', warn))
    .pipe(gulp.dest(paths.dst))
    .pipe(connect.reload());
});

gulp.task("coffee", function(){
  return gulp.src(paths.src + "**/*.coffee")
    .pipe(changed(paths.dst, { extension: '.js' }))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(coffee().on('error', warn))
    .pipe(gulp.dest(paths.dst))
    .pipe(connect.reload());
});
//
