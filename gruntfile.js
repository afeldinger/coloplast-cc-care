module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          livereload: true,
      },
      scripts: {
        files: ['_source/assets/js/**/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        },
      },
      images: {
        files: ['_source/assets/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
        options: {
          spawn: false,
        }
      },

      svgstore: {
        files: ['_source/assets/img/svg-defs/**/*.svg'],
        tasks: ['svgstore:dev'],
      },

      styles: {
        files: ['_source/assets/sass/**/*.scss'],
        tasks: ['compass:dev', 'autoprefixer:dev'],
        options: {
            spawn: false,
        }
      },

      handlebars: {
        files: ['_source/layouts/*.hbs', '_source/partials/**/*.hbs', '_source/pages/*.hbs', '_source/data/*.json'],
        tasks: ['assemble'],
      },
    },


    // Assembles your page content with html layout
    assemble: {
      options: {
        layoutdir: '_source/layouts',
        partials: ['_source/partials/**/*.hbs'],
        assets: './_source/assets',
        helpers: [
          'handlebars-helpers',
          'handlebars-helper-partial',
          'handlebars-helper-autolink',
          'handlebars-helper-isactive',
        ],
        
        collections: [
          {
            title: 'pages',
            sortby: 'sortorder',
            sortorder: 'asc', 
          }
        ],
        
        articles: grunt.file.readJSON('_source/data/articles.json'),
        sections: grunt.file.readJSON('_source/data/sections.json'),

        //flatten: true,
        marked: {
          gfm: false,
        }
      },

      pages: {
        files: [{
          cwd: './_source/pages/',
          dest: 'dist/',
          expand: true,
          src: '**/*.hbs',
        }]
      },

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
    },

    uglify: {
      js: {
          src: 'dist/assets/js/scripts.js',
          dest: 'dist/assets/js/scripts.min.js',
      },
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
                src: ['**/*.svg', '!svg-defs.svg'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    svgstore: {
      options: {
        prefix : 'shape-', // This will prefix each ID
        cleanup: ['fill', 'stroke'],
        cleanupdefs: true,
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          style: 'display:none',
          //viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        formatting: {
          indent_size: 2,
          max_preserve_newlines: 1,
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
        dev: {
            files: {
                '_source/assets/css/default.css': '_source/assets/css/default.css',
            },
        },
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '_source/assets/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/assets/css',
          ext: '.min.css',
        }]
      },
    },
    
    clean: {
      dist: {
        src: ['dist/*', '!dist/.htaccess'],
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true, 
          cwd: '_source/assets/fonts/', 
          src: ['**/*'],
          dest: 'dist/assets/fonts/',
        }],
      },

    },

    useminPrepare: {
      html: 'dist/01-frontpage.html',
      options: {
          dest: 'dist/'
      }
    },

    usemin: {
      html: 'dist/**/*.html',
    },


    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /\.\.\/_source\/assets\/img/g,
              replacement: 'assets/img',
            }
          ]
        },
        files: [
          {
            expand: true, 
            flatten: true, 
            src: ['dist/**/*.{html,css}'], 
            dest: 'dist/'
          }
        ]
      },
    },


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
    'concat',
    'cssmin',
    'uglify',
    'useminPrepare', 
    'usemin',
    'copy:dist',
    'replace:dist',

  ]);

};