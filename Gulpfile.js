var path = require("path"),
    _ = require("lodash"),
    sequence = require("run-sequence"),
    gulp = require("gulp"),
    less = require("gulp-less"),
    clean = require("gulp-clean"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    watchify = require("watchify"),
    reactify = require("reactify"),
    browserify = require("browserify"),
    livereload = require("gulp-livereload"),

    mappedPaths = {
      'styles': 'client/styles',
      'dist': '.dist'
    },

    options = {
      env: process.env.NODE_ENV || "development",
      sourcemaps: false,
      minify: false,
      watch: false,
      debug: false
    };

gulp.task("watch", function(done) {
  options.watch = true;
  options.debug = true;
  options.sourcemaps = false;

  sequence("build", "livereload", done);
});

gulp.task("dist", function(done) {
  options.env = "production";
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

  gulp.watch(dir("styles", "**/*.less"), ["styles"]);
  gulp.watch(dir("dist", "**/*")).on("change", livereload.changed);
});

gulp.task("clean", function() {
  return gulp.src(dir("dist"), { read: false }).pipe(clean());
});

gulp.task('styles', buildStyles);
gulp.task("scripts", buildScripts);

function buildScripts() {
  var bundler,
      entryPoint = "./client",

      bundlerOptions = {
        debug: options.debug,
        extensions: [".js", ".jsx"]
      };

  if (options.watch) {
    bundler = watchify(entryPoint, options);
    bundler.on("update", makeBundle);
  } else {
    bundler = browserify(entryPoint, options);
  }

  bundler.transform(reactify);

  function makeBundle() {
    var bundle = bundler.bundle();

    return bundle.on("error", handleError("browserify"))
                 .pipe(source("client.js"))
                 .pipe(gulp.dest(dir("dist")));

  }

  return makeBundle();
}

function buildStyles() {
  var srcDir = dir('styles', 'client.less'),
      destDir = dir('dist', 'styles'),
      lessOptions = {
        paths: [ "node_modules" ]
      },
      stream;

  if (options.minify) {
    lessOptions.compress = true;
  }

  stream = gulp.src(srcDir);
  if (options.sourcemaps) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(less(lessOptions));

  if (options.sourcemaps) {
    stream = stream.pipe(sourcemaps.write());
  }
  return stream.pipe(gulp.dest(destDir));
}

function dir(root) {
  var args = _.toArray(arguments);
  args[0] = mappedPaths[root] || root;
  return path.join.apply(path, args);
}

function handleError(errSection) {
  return function(err) {
    console.log(errSection, err);
  }
}


