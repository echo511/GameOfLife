const gulp = require("gulp");
const browserify = require("browserify");
const watchify = require("watchify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const fancy_log = require("fancy-log");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");

function copyHtmls() {
    return gulp
        .src(["src/*.html"])
        .pipe(gulp.dest("dist"));
}

function scriptsConversion() {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["src/main.ts"],
        cache: {},
        packageCache: {},
    }).plugin(tsify);
}

function bundle(stack) {
    return stack
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}

function build() {
    return bundle(scriptsConversion())
}

function watch() {
    const watchedBrowserify = watchify(scriptsConversion())

    const doWatch = function () {
        bundle(watchedBrowserify)
    }

    watchedBrowserify
        .on("error", fancy_log)
        .on("log", fancy_log)
        .on("update", doWatch)

    return doWatch()
}

gulp.task("build", gulp.series(copyHtmls, build));

gulp.task("default", gulp.series(copyHtmls, watch));