/// <binding ProjectOpened='copy-bower-dependencies' />
var gulp = require("gulp");
var gulpFilter = require("gulp-filter");
var mainBowerFiles = require("main-bower-files");
var uglify = require("gulp-uglify");
var minifycss = require("gulp-clean-css");
var rename = require("gulp-rename");
var merge = require("merge-stream");
var debug = require("gulp-debug");
var concat = require("gulp-concat");
var exec = require("gulp-exec");
var wait = require("gulp-wait");
var requirejsOptimize = require("gulp-requirejs-optimize");

var dest_path = ".";
var pre_dest_path = "./prewww";

gulp.task("copy-bower-dependencies", function() {
  var jsFilter = gulpFilter("**/*.js", { restore: true });
  var cssFilter = gulpFilter("**/*.css", { restore: true });
  var otfFilter = gulpFilter("**/*.otf", { restore: true });
  var eotFilter = gulpFilter("**/*.eot", { restore: true });
  var svgFilter = gulpFilter("**/*.svg", { restore: true });
  var ttfFilter = gulpFilter("**/*.ttf", { restore: true });
  var woffFilter = gulpFilter("**/*.woff", { restore: true });
  var woff2Filter = gulpFilter("**/*.woff2", { restore: true });

  return (
    gulp
      .src(mainBowerFiles())
      // grab vendor js files from bower_components, minify and push in /public
      .pipe(jsFilter)
      .pipe(debug({ title: "copy-dependencies:", minimal: false }))
      .pipe(uglify())
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(gulp.dest(dest_path + "/scripts"))
      .pipe(jsFilter.restore)

      // grab vendor css files from bower_components, minify and push in /public
      .pipe(cssFilter)
      .pipe(minifycss())
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(gulp.dest(dest_path + "/css"))
      .pipe(cssFilter.restore)

      // grab vendor font files from bower_components push in /public
      .pipe(otfFilter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(otfFilter.restore)
      .pipe(eotFilter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(eotFilter.restore)
      .pipe(svgFilter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(svgFilter.restore)
      .pipe(ttfFilter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(ttfFilter.restore)
      .pipe(woffFilter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(woffFilter.restore)
      .pipe(woff2Filter)
      .pipe(gulp.dest(dest_path + "/fonts"))
      .pipe(woff2Filter.restore)
  );
});

gulp.task("copy-default-files", function() {
  gulp.src("./index.html").pipe(gulp.dest(pre_dest_path));
  gulp.src("./favicon.ico").pipe(gulp.dest(pre_dest_path));
});

gulp.task("copy-templates", function() {
  gulp.src("./templates/*.html").pipe(gulp.dest(pre_dest_path + "/templates"));
});

gulp.task("copy-css", function() {
  gulp.src("./css/*.css").pipe(gulp.dest(pre_dest_path + "/css"));
});

gulp.task("copy-fonts", function() {
  gulp.src("./fonts/*.*").pipe(gulp.dest(pre_dest_path + "/fonts"));
});

gulp.task("copy-images", function() {
  gulp.src("./images/*.*").pipe(gulp.dest(pre_dest_path + "/images"));
});

gulp.task("copy-scripts", function() {
  gulp.src("./scripts/*").pipe(gulp.dest(pre_dest_path + "/scripts"));
});

gulp.task("copy-js", function() {
  gulp.src("./js/**/*.js").pipe(gulp.dest(pre_dest_path + "/js"));
});

gulp.task("requirejs-build", function() {
  gulp
    .src(".")
    .pipe(wait(1000))
    .pipe(exec("r.js.cmd -o requirejs-build.js", {}))
    .pipe(exec.reporter({}));
});

gulp.task("build-prewww", [
  "copy-default-files",
  "copy-templates",
  "copy-css",
  "copy-fonts",
  "copy-images",
  "copy-js",
  "copy-scripts"
]);

gulp.task("build-www", function() {
  return gulp
    .src("requirejs-build.js")
    .pipe(requirejsOptimize())
    .pipe(gulp.dest("./www"));
});

gulp.task("build", ["build-prewww", "build-www"]);

gulp.task("default", ["copy-bower-dependencies"]);
