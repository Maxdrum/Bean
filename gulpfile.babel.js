/* jshint node: true, strict: true */
'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  appName : 'ZJSY_Admin',
  superAppName : 'ZJSY_SuperAdmin',
  webappName : 'ZJSY_WebappAdmin',
  propertyAppName : 'ZJSY_PropertyAdmin',
  dest: 'www',
  cordova: true,
  host : "",
  sass: {
    src: [
      './src/sass/admin/app.scss'],

      superSrc: [
          './src/sass/super/app.scss'
      ],
      webappSrc: [
          './src/sass/super/app.scss'
      ],
      propertySrc: [
          './src/sass/property/app.scss'
      ],
    paths: [
      './src/sass' //'./bower_components'
    ],
    libcss:{
        src :['./bower_components/quill/dist/quill.snow.css']//['./bower_components/angular-bootstrap/ui-bootstrap-csp.css']
    }
  },
    less: {
        src: [
            './bower_components/bootstrap/less/bootstrap.less'
        ],
        paths: [
            './bower_components'
        ],

    },
  vendor: {
    js: [
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/angular/angular.js',
      './bower_components/jquery-zclip/jquery-zclip.js',
      './bower_components/ng-file-upload/ng-file-upload.min.js',
      './bower_components/ng-file-upload/ng-file-upload-shim.min.js',
      './bower_components/moment/min/moment.min.js',
      './bower_components/angular-ui-router/release/angular-ui-router.js',
      './bower_components/angular-bootstrap/ui-bootstrap.js',
      './bower_components/angular-i18n/angular-locale_zh-cn.js',
      './bower_components/bootstrap/dist/js/bootstrap.min.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/lodash/lodash.js',
      './bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js'
    ],
      superJs: [
          './bower_components/jquery/dist/jquery.min.js',
          './bower_components/quill/dist/quill.js',
          //'./bower_components/jquery-ui/jquery-ui.min.js',
          './bower_components/angular/angular.js',
          './bower_components/ng-file-upload/ng-file-upload.min.js',
          './bower_components/ng-file-upload/ng-file-upload-shim.min.js',
          './bower_components/moment/min/moment.min.js',
          './bower_components/angular-ui-router/release/angular-ui-router.js',
          './bower_components/angular-bootstrap/ui-bootstrap.js',
          './bower_components/angular-i18n/angular-locale_zh-cn.js',
          './bower_components/bootstrap/dist/js/bootstrap.min.js',
          './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          './bower_components/lodash/lodash.js',
          './bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
          //'./bower_components/angular-file-saver/dist/angular-file-saver.min.js',
          //'./bower_components/blob-polyfill/Blob.js',
          //'./bower_components/file-saver.js/FileSaver.js',
          //'./bower_components/js-xlsx/dist/xlsx.core.min.js'
          //'./bower_components/angular-ui-sortable/sortable.min.js'
      ],
      propertyJs: [
          './bower_components/jquery/dist/jquery.min.js',
          './bower_components/angular/angular.js',
          './bower_components/ng-file-upload/ng-file-upload.min.js',
          './bower_components/ng-file-upload/ng-file-upload-shim.min.js',
          './bower_components/angular-ui-router/release/angular-ui-router.js',
          './bower_components/angular-bootstrap/ui-bootstrap.js',
          './bower_components/angular-i18n/angular-locale_zh-cn.js',
          './bower_components/bootstrap/dist/js/bootstrap.min.js',
          './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          './bower_components/lodash/lodash.js',
      ],
      webappJs: [
          './bower_components/jquery/dist/jquery.min.js',
          './bower_components/angular/angular.js',
          './bower_components/angular-ui-router/release/angular-ui-router.js',
          './bower_components/angular-bootstrap/ui-bootstrap.js',
          './bower_components/bootstrap/dist/js/bootstrap.min.js',
          './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          './bower_components/lodash/lodash.js'
      ],

    css: {
      prepend: [],
      append: [],
    },

    fonts: [
      './bower_components/bootstrap/fonts/*.*'
    ]
  },

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  weinre: {
    httpPort:     8001,
    boundHost:    'localhost',
    verbose:      false,
    debug:        false,
    readTimeout:  5,
    deathTimeout: 15
  }
};

console.log('process.argv[3]',process.argv)
switch (process.argv[4]){
    case '49' : config.host = "http://192.168.6.49";break;
    case 'pro' : config.host = "https://zjsy.sliver-square.com";break;
    case undefined :config.host = "http://192.168.6.49";break;
    default : config.host = process.argv[4];break;
}

if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
    seq            = require('run-sequence'),
    connect        = require('gulp-connect'),
    less           = require('gulp-less'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    cssmin         = require('gulp-cssmin'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),
    templateCache  = require('gulp-angular-templatecache'),
    mobilizer      = require('gulp-mobilizer'),
    ngAnnotate     = require('gulp-ng-annotate'),
    replace        = require('gulp-replace'),
    ngFilesort     = require('gulp-angular-filesort'),
    streamqueue    = require('streamqueue'),
    rename         = require('gulp-rename');
import path from 'path';
import babel from 'gulp-babel';
import sass from 'gulp-sass';



/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', (e) => {
    console.log(e.stack);
  throw(e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  return gulp.src([
        path.join(config.dest, 'index.html'),
        path.join(config.dest, 'super.html'),
        path.join(config.dest, 'images'),
        path.join(config.dest, 'css'),
        path.join(config.dest, 'js'),
        path.join(config.dest, 'fonts')
      ], { read: false })
     .pipe(rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
  if (typeof config.server === 'object') {
    connect.server({
      root: config.dest,
      host: config.server.host,
      port: config.server.port,
      //livereload: true
    });
  } else {
    throw new Error('Connect is not configured');
  }
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function () {
  gulp.src(path.join(config.dest, '*.html'))
    .pipe(connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function () {
  return gulp.src('src/images/*')
        .pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
  .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
  var inject = [];
  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://'+config.weinre.boundHost+':'+config.weinre.httpPort+'/target/target-script-min.js"></script>');
  }
  if (config.cordova) {
    inject.push('<script src="cordova.js"></script>');
  }
  gulp.src(['src/html/**/*.html'])
  .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
  .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify, mobilize sass                            =
======================================================================*/

gulp.task('sass', function () {
    return gulp.src(config.sass.src).pipe(
    sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
    }))
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});
gulp.task('superSass', function () {
    return gulp.src(config.sass.superSrc).pipe(
        sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }))
        .pipe(mobilizer('app.css', {
            'superApp.css': {
                hover: 'exclude',
                screens: ['0px']
            },
            'superAppHover.css': {
                hover: 'only',
                screens: ['0px']
            }
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(config.dest, 'css')));
});
gulp.task('propertySass', function () {
    return gulp.src(config.sass.propertySrc).pipe(
        sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }))
        .pipe(mobilizer('app.css', {
            'propertyApp.css': {
                hover: 'exclude',
                screens: ['0px']
            },
            'propertyAppHover.css': {
                hover: 'only',
                screens: ['0px']
            }
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(config.dest, 'css')));
});
gulp.task('webappSass', function () {
    return gulp.src(config.sass.webappSrc).pipe(
        sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }))
        .pipe(mobilizer('app.css', {
            'webappApp.css': {
                hover: 'exclude',
                screens: ['0px']
            },
            'webappHover.css': {
                hover: 'only',
                screens: ['0px']
            }
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(config.dest, 'css')));
});

gulp.task('less', function () {
    return gulp.src(config.less.src.concat(config.sass.libcss.src)).pipe(less({
        paths: config.less.paths.map(function(p){
            return path.resolve(__dirname, p);
        })
    })).pipe(concat('lib.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(config.dest, 'css')));
});


//gulp.task('libcss', function () {
//    return gulp.src(config.sass.libcss.src)
//        .pipe(concat('lib.css'))
//        .pipe(cssmin())
//        .pipe(rename({suffix: '.min'}))
//        .pipe(gulp.dest(path.join(config.dest, 'css')));
//});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
    streamqueue({ objectMode: true },
        gulp.src('./src/js/config.js').pipe(babel())
            .pipe(replace('<replaceSec>', config.host)),
        gulp.src('./src/js/admin/**/*.js').pipe(babel()).pipe(ngFilesort()),
        gulp.src(['src/templates/admin/*.html']).pipe(templateCache({ module: config.appName }))
    )
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('superJs', function() {
    console.log('config.host',config.host)
    streamqueue({ objectMode: true },
        gulp.src('./src/js/config.js').pipe(babel())
            .pipe(replace('<replaceSec>', config.host)),
        gulp.src('./src/js/super/**/*.js').pipe(babel()).pipe(ngFilesort()),
        gulp.src(['src/templates/super/*.html']).pipe(templateCache({ module: config.superAppName }))
    )
        .pipe(sourcemaps.init())
        .pipe(concat('superApp.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('propertyJs', function() {
    streamqueue({ objectMode: true },
        gulp.src('./src/js/config.js').pipe(babel())
            .pipe(replace('<replaceSec>', config.host)),
        gulp.src('./src/js/property/**/*.js').pipe(babel()).pipe(ngFilesort()),
        gulp.src(['src/templates/property/*.html']).pipe(templateCache({ module: config.propertyAppName }))
    )
        .pipe(sourcemaps.init())
        .pipe(concat('propertyApp.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('webappJs', function() {
    streamqueue({ objectMode: true },
        gulp.src('./src/js/config.js').pipe(babel())
            .pipe(replace('<replaceSec>', config.host)),
        gulp.src('./src/js/webapp/**/*.js').pipe(babel()).pipe(ngFilesort()),
        gulp.src(['src/templates/webapp/*.html']).pipe(templateCache({ module: config.webappName }))
    )
        .pipe(sourcemaps.init())
        .pipe(concat('webappApp.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});

gulp.task('libjs', function() {
    streamqueue({ objectMode: true },
        gulp.src(config.vendor.js)
    )
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('superLibjs', function() {
    streamqueue({ objectMode: true },
        gulp.src(config.vendor.superJs)
    )
        .pipe(sourcemaps.init())
        .pipe(concat('superLib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('propertyLibjs', function() {
    streamqueue({ objectMode: true },
        gulp.src(config.vendor.propertyJs)
    )
        .pipe(sourcemaps.init())
        .pipe(concat('propertyLib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});
gulp.task('webappLibjs', function() {
    streamqueue({ objectMode: true },
        gulp.src(config.vendor.webappJs)
    )
        .pipe(sourcemaps.init())
        .pipe(concat('webappLib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function () {
  //if (typeof config.server === 'object') {
  //  gulp.watch([config.dest + '/**/*'],['livereload']);
  //}
  gulp.watch(['./src/html/**/*'], ['html']);
  gulp.watch(['./src/sass/admin/*'], ['sass']);
  gulp.watch(['./bower_components/**/*.less'], ['less']);
  gulp.watch(['./src/js/admin/**/*', './src/templates/admin/**/*', config.vendor.js], ['js']);
  gulp.watch([config.vendor.js], ['libjs']);
  gulp.watch(['./src/images/**/*'], ['images']);

    gulp.watch(['./src/sass/super/*'], ['superSass']);
    gulp.watch(['./src/js/super/**/*', './src/templates/super/**/*'], ['superJs']);

    gulp.watch(['./src/sass/property/*'], ['propertySass']);
    gulp.watch(['./src/js/property/**/*', './src/templates/property/**/*'], ['propertyJs']);

    gulp.watch(['./src/sass/webapp/*'], ['webappSass']);
    gulp.watch(['./src/js/webapp/**/*', './src/templates/webapp/**/*'], ['webappJs']);
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
  if (typeof config.weinre === 'object') {
    var weinre = require('./node_modules/weinre/lib/weinre');
    weinre.run(config.weinre);
  } else {
    throw new Error('Weinre is not configured');
  }
});


/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build', function(done) {
  var tasks = ['html', 'fonts', 'images',
      'sass',
      'libjs',
      'js',

      'superSass',
      'superLibjs',
      'superJs',

      'propertySass',
      'propertyLibjs',
      'propertyJs',

      'webappSass',
      'webappLibjs',
      'webappJs',

      'less'

  ];
  seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = [];

  if (typeof config.weinre === 'object') {
    tasks.push('weinre');
  }

  if (typeof config.server === 'object') {
    tasks.push('connect');
  }

  tasks.push('watch');

  seq('build', tasks, done);
});
