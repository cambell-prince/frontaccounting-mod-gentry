var gulp = require('gulp');
var gutil = require('gulp-util');
var child_process = require('child_process');
var exec2 = require('child_process').exec;
var async = require('async');
var template = require('lodash.template');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var execute = function(command, options, callback) {
  if (options == undefined) {
    options = {};
  }
  command = template(command, options);
  if (!options.silent) {
    gutil.log(gutil.colors.green(command));
  }
  if (!options.dryRun) {
    if (options.env == undefined) {
      exec2(command, function(err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(gutil.colors.yellow(stderr));
        callback(err);
      });
    } else {
      exec2(command, {env: options.env}, function(err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(gutil.colors.yellow(stderr));
        callback(err);
      });
    }
  } else {
    callback(null);
  }
};

var paths = {
  src: ['**/*.js', '**/*.html', '**/*.php', '**/*.inc', '!vendor_bower/**'],
  src_js: ['./*.js', 'src/*', 'views/*.js', '!gulpfile.js'],
  reload: ['assets/*', 'views/*.html', 'gentry.html', '**/*.php', '**/*.inc', '!vendor_bower/**']
};

// livereload
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('do-reload', function() {
  return gulp.src('../index.php').pipe(livereload(server));
});

gulp.task('reload', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }
    gulp.watch(paths.reload, [ 'do-reload' ]);
    gulp.watch(paths.src_js, ['javascript']);
  });
});

gulp.task('javascript', function() {
  gulp.src(paths.src_js, { base: '.' })
    .pipe(sourcemaps.init())
      .pipe(concat('gentry-min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.', {
      sourceMappingURLPrefix: '/modules/sgw_gentry/assets/',
      sourceRoot: '/modules/sgw_gentry/'
    }))
    .pipe(gulp.dest('assets'));
});

gulp.task('javascript-watch', function() {
  gulp.watch(paths.src_js, ['javascript']);
});

gulp.task('package-zip', function(cb) {
  var options = {
    dryRun: false,
    silent: false,
    src: "./htdocs",
    name: "frontaccounting-mod-gentry",
    version: "2.3.22",
    release: "-1"
  };
  execute(
    'rm -f *.zip && cd <%= src %> && zip -r -x@../upload-exclude-zip.txt -q ../<%= name %>-<%= version %><%= release %>.zip *',
    options,
    cb
  );
});

gulp.task('package-tar', function(cb) {
  var options = {
    dryRun: false,
    silent: false,
    src: "./htdocs",
    name: "frontaccounting-mod-gentry",
    version: "2.3.22",
    release: "-1"
  };
  execute(
    'rm -f *.tgz && cd <%= src %> && tar -cvzf ../<%= name %>-<%= version %><%= release %>.tgz -X ../upload-exclude.txt *',
    options,
    cb
  );
});

gulp.task('package', ['package-zip', 'package-tar']);

gulp.task('upload', function(cb) {
  var options = {
    dryRun: false,
    silent : false,
    src : "htdocs",
    dest : "root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/"
  };
  execute(
    'rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --delete --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2006 rsync" --rsh="ssh" <%= src %>/ <%= dest %>',
    options,
    cb
  );
});

gulp.task('upload-demo', function(cb) {
  var options = {
    dryRun: false,
    silent : false,
    src : "htdocs",
    dest : "root@saygoweb.com:/var/www/virtual/saygoweb.com/demo/htdocs/frontaccounting/",
    key : ""
  };
  execute(
    'rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --delete --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2006 rsync" --rsh="ssh" <%= src %>/ <%= dest %>',
    options,
    cb
  );
});

/*
 * /c/src/cygwin64/bin/rsync.exe -vaz --rsh="ssh -i ~/ssh/dev-cp-private.key" *
 * root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/
 */

gulp.task('tasks', function(cb) {
  var command = 'grep gulp\.task gulpfile.js';
  execute(command, null, function(err) {
    cb(null); // Swallow the error propagation so that gulp doesn't display a nodejs backtrace.
  });
});

gulp.task('watch', function() {
//  gulp.watch([paths.src, paths.testE2E], ['test-current']);
  gulp.watch([paths.testUnit, paths.src], ['test-php']);
});
