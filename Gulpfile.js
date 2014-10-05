var path = require("path"),
    _ = require("lodash"),
    sequence = require("run-sequence"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    clean = require("gulp-clean"),
    source = require("vinyl-source-stream"),
    gutil = require("gulp-util"),
    sourcemaps = require("gulp-sourcemaps"),
    watchify = require("watchify"),
    browserify = require("browserify"),
    livereload = require("gulp-livereload"),

    mappedPaths = {
      'styles': 'client/styles',
      'dist': '.dist'
    },

    options = {
      env: process.env.NODE_ENV,
      sourcemaps: false,
      minify: false,
      watch: false,
      debug: false
    };

gulp.task("watch", function(done) {
  options.env = options.env || "development";
  options.watch = true;
  options.debug = true;
  options.sourcemaps = true;

  sequence("build", "livereload", done);
});

gulp.task("dist", function(done) {
  options.env = options.env || "production";
  options.minify = true;

  sequence(
    "build",
    done
  );
});

gulp.task("build", function(done) {
  sequence(
    "clean",
    ["styles", "scripts"],
    done
  );
});

gulp.task("livereload", function() {
  livereload.listen();

  gulp.watch(dir("styles", "**/*.{sass,scss}"), ["styles"]);
  gulp.watch(dir("dist", "**/*")).on("change", livereload.changed);
});

gulp.task("clean", function() {
  return gulp.src(dir("dist"), { read: false }).pipe(clean());
});

gulp.task('styles', buildStyles);
gulp.task("scripts", buildScripts);

function buildScripts() {
  var bundler,
      entryPoint = "./client/index.js",

      bundlerOptions = {
        basedir: __dirname,
        debug: options.debug,
        extensions: [".js", ".jsx"],
        cache: {},
        packageCache: {},
        fullPaths: true
      };

  bundler = browserify(entryPoint, bundlerOptions);

  if (options.watch) {
    bundler = watchify(bundler);
    bundler.on("update", makeBundle);
  }

  bundler.transform("reactify");

  function makeBundle() {
    var bundle = bundler.bundle();

    return bundle.on("error", handleError("browserify"))
                 .pipe(source("client.js"))
                 .pipe(gulp.dest(dir("dist")));

  }

  return makeBundle();
}

function buildStyles() {
  var srcDir = dir('styles', 'client.scss'),
      destDir = dir('dist', 'styles'),
      sassOptions = {
        includePaths: [ "bower_components/foundation/scss" ]
      },
      sourcemapsInit = options.sourcemaps ? sourcemaps.init() : gutil.noop();
      sourcemapsWrite = options.sourcemaps ? sourcemaps.write() : gutil.noop();

  sassOptions.outputStyle = options.minify ? "compressed" : "nested";
  sassOptions.errLogToConsole = !!options.watch;

  return  gulp.src(srcDir)
              .pipe(sourcemapsInit)
              .pipe(sass(sassOptions))
              .pipe(sourcemapsWrite)
              .pipe(gulp.dest(destDir));
}

function dir(root) {
  var args = _.toArray(arguments);
  args[0] = mappedPaths[root] || root;
  return path.join.apply(path, args);
}

function handleError(errSection) {
  return function(err) {
    gutil.log(gutil.colors.bgRed(errSection), err);
  }
}


