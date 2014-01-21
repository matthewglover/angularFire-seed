// File base on yeoman angular gruntfile, adapted for angularFire-seed structure
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    project: {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watch for changes and run tasks on changed files
    watch: {
      js: {
        files: ['<%= project.app %>/js/{,*/}*.js', '<%= project.app %>/*.html'],
        tasks: ['newer:jshint:all', 'karma'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/unit/{,*/}*.js', 'test/mock/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= project.app %>/css/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '<%= project.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          base: [
            '.tmp',
            '<%= project.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= project.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= project.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        // ignore angularFire-seed javascript files
        ignores: [
          '<%= project.app %>/js/service.login.js',
          '<%= project.app %>/js/service.firebase.js',
          '<%= project.app %>/js/routes.js',
          '<%= project.app %>/js/module.waitForAuth.js',
          '<%= project.app %>/js/module.routeSecurity.js',
          '<%= project.app %>/js/filters.js',
          '<%= project.app %>/js/directives.js',
          '<%= project.app %>/js/controllers.js'
        ]
      },
      all: [
        'Gruntfile.js',
        '<%= project.app %>/js/{,*/}*.js',
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc',
          ignores: [
            'test/unit/servicesSpec.js',
            'test/unit/configSpec.js'
          ]
        },
        src: ['test/unit/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed css
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '{,*/}*.css',
          dest: '.tmp/css/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= project.app %>/index.html',
        ignorePath: '<%= project.app %>/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= project.app %>/css',
        cssDir: '.tmp/css',
        generatedImagesDir: '.tmp/img/generated',
        imagesDir: '<%= project.app %>/img',
        javascriptsDir: '<%= project.app %>/js',
        fontsDir: '<%= project.app %>/css/fonts',
        importPath: '<%= project.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= project.dist %>/img/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %>/css/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= project.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %>/img'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/img',
          src: '{,*/}*.svg',
          dest: '<%= project.dist %>/img'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['*.html', 'partials/{,*/}*.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/js',
          src: '*.js',
          dest: '.tmp/concat/js'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= project.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= project.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= project.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bower-install',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};