module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          livereload: true,
      },
      scripts: {
        files: ['_source/js/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        },
      },
      images: {
        files: ['_source/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
        options: {
          spawn: false,
        }
      },
      styles: {
        files: ['_source/sass/**/*.scss'],
        tasks: ['compass:dev', 'autoprefixer'],
        options: {
            spawn: false,
        }
      },

      handlebars: {
        files: ['_source/layouts/*.hbs', '_source/includes/**/*.hbs', '_source/pages/*.hbs', '_source/contents/*.hbs'],
        tasks: ['assemble'],
      },

      html: {
        files: ['./*.html'],
        tasks: [],
      }
    },


    // Assembles your page content with html layout
    assemble: {
      options: {
        layoutdir: '_source/layouts',
        partials: ['_source/partials/**/*.hbs'],
        assets: '_source/assets',
        helpers: [
          'handlebars-helpers',
          'handlebars-helper-autolink',
          'handlebars-helper-isactive',
        ],

        collections: ['articles'],

        //flatten: true,
        marked: {
          gfm: false,
        }
      },

      pages: {
        files: [{
          cwd: './_source/content/',
          dest: 'dist/',
          expand: true,
          src: '**/*.hbs',
        }, {
          cwd: './_source/pages/',
          dest: 'dist/',
          expand: true,
          src: '**/*.hbs',
        }]
      }

    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false,
          preserveLineBreaks: true,
        },
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      },
    },

    prettify: {
      dist: {
        options: {
          indent: 2,
          condense: true,
          indent_inner_html: true,
          preserve_newlines: true,
          max_preserve_newlines: 1,
          unformatted: [
            "a",
            "pre",
            "code"
          ]
        },
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['_source/assets/js/{,**/}*.js', '!_source/assets/js/{,**/}*.min.js']
    },

    concat: { 
      js: {
          src: [
              '_source/assets/js/libs/*.js', // All JS in the libs folder
              '_source/assets/js/*.js'  // Custom JS files
          ],
          dest: 'dist/assets/js/scripts.js',
      },
      dist: {}
    },

    uglify: {
      js: {
          src: 'dist/assets/js/scripts.js',
          dest: 'dist/assets/js/scripts.min.js',
      },
      dist: {}
    },


    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '_source/assets/img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    svgmin: {
        options: {
            plugins: [
                {
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '_source/assets/img/',
                src: ['**/*.svg', '!svg-defs/**/*.svg'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    svgstore: {
      options: {
        prefix : 'shape-', // This will prefix each ID
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          style: 'display:none',
          //viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        }
      },
      dev: {
        files: {
          '_source/assets/img/svg-defs.svg': ['_source/assets/img/svg-defs/*.svg'],
        }
      },
      dist: {
        files: {
          'dist/assets/img/svg-defs.svg': ['dist/assets/img/svg-defs/*.svg'],
        }
      },
    },

    /*
    sass: {
        dist: {
            options: {
                style: 'expanded', //'compressed'
                require: ['compass', 'sass-globbing'],
            },
            expand: true,
            cwd: './_source/sass/',
            src: ['*.scss'],
            dest: './assets/css/',
            ext: '.css'
        } 
    },
    */


    compass: {
      options: {
        config: 'config.rb',
        bundleExec: true,
        force: true
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment: 'production'
        }
      }
    },



    autoprefixer: {
        dist: {
            files: {
                '_source/assets/css/default.css': '_source/assets/css/default.css',
            },
        },
    },
    
    clean: {
      dist: {
        src: ['dist*'],
      }
    }

    useminPrepare: {
      html: 'dist/01-frontpage.html',
      options: {
          dest: 'dist/'
      }
    },

    usemin: {
      html: 'dist/**/*.html',
      dist: {}
    }


  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', 'assemble']).forEach(grunt.loadNpmTasks);

  // Default task(s).
  grunt.registerTask('default', ['assemble', 'svgstore:dev', 'compass:dist', 'autoprefixer']);

  // Build minified assets
  grunt.registerTask('build', [
    'clean:dist',
    'default',
    'htmlmin', 
    'prettify', 
    'imagemin',
    'svgmin',
    'svgstore:dist',
    'useminPrepare', 
    'concat:generated',
    //'cssmin:generated',
    'uglify:generated',
    'usemin'
  ]);

};