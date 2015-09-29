module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          livereload: true,
      },
      scripts: {
        files: ['_source/assets/js/*.js'],
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

      sprites: {
        files: ['_source/assets/img/{sprites,sprites-2x}/*.png'],
        tasks: ['sprite'],
      },

      iconfonts: {
        files: ['_source/assets/fonts/icons/*.svg'],
        tasks: ['font'],
      },


      globbing: {
        files: ['_source/assets/sass/**/*.scss'],
        tasks: ['sass_globbing:dev'],
        options: {
          event: ['added', 'deleted'],
        },
      },
      styles: {
        files: ['src/assets/sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer:dev'],
        options: {
            spawn: false,
        }
      },

//      styles: {
//        files: ['_source/assets/sass/**/*.scss'],
//        tasks: ['compass:dev', 'autoprefixer:dev'],
//        options: {
//            spawn: false,
//        }
//      },

      handlebars: {
        files: ['_source/layouts/*.hbs', '_source/partials/**/*.hbs', '_source/pages/*.hbs', '_source/data/*.json'],
        tasks: ['assemble'],
      },
    },


    font: {
      all: {
        // SVG files to read in 
        src: ['_source/assets/fonts/icons/*.svg'],
   
        // Location to output CSS variables 
        destCss: [
          //'_source/assets/css/icons.css',
          '_source/assets/sass/base/_cc_icons.scss'
        ],
   
        // Location to output fonts (expanded via brace expansion) 
        destFonts: '_source/assets/fonts/cc-icons.{svg,woff,eot,ttf}',
   
        // Optional: Custom naming of font families for multi-task support 
        fontFamily: 'cc-icons',


        cssRouter: function (fontpath) {
          return fontpath.replace('_source/assets','..');

        },
      }
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
          './_source/helpers/*.js',
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
      all: [
        '_source/assets/js/{,**/}*.js', 
        '!_source/assets/js/{libs,localization}/**/*.js'
      ]
    },
/*
    concat: { 
      js: {
          src: [
              //'_source/assets/js/libs/*.js', // All JS in the libs folder
              //'_source/assets/js/libs/dropkick/*.js', // All JS in the libs folder
              //'_source/assets/js/*.js'  // Custom JS files
              //'_source/assets/js/libs/jquery-*.js', // jquery core
              '_source/assets/js/libs/jquery.flexslider-min.js',
              '_source/assets/js/libs/jquery.magnific*.js',
              '_source/assets/js/libs/dropkick/dropkick.js',
              '_source/assets/js/libs/jquery.validate.min.js',
              '_source/assets/js/main.js',
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
*/
    sprite:{
      retina: {
        src: '_source/assets/img/sprites-2x/*.png',
        dest: '_source/assets/img/sprites-2x.png',
        destCss: '_source/assets/sass/abstractions/_sprites-2x.scss',
        imgPath: '../img/sprites-2x.png',
        cssVarMap: function (sprite) {
          sprite.name = 'sprite_' + sprite.name + '_2x';
        },
      },
      normal: {
        src: '_source/assets/img/sprites/*.png',
        dest: '_source/assets/img/sprites.png',
        destCss: '_source/assets/sass/abstractions/_sprites.scss',
        imgPath: '../img/sprites.png',
        cssVarMap: function (sprite) {
          sprite.name = 'sprite_' + sprite.name;
        }
      },

    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '_source/assets/img/',
                src: [
                  '**/*.{png,jpg,gif}',
                  '!sprites/*',
                  '!sprites-2x/*'
                ],
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
                src: ['**/*.svg'],
                dest: 'dist/assets/img/'
            }]
        }
    },
/*
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
*/

    // Grunt-sass 
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '_source/src/assets/sass',
          src: ['**/*.scss'],
          dest: 'dist/assets/css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        //sourceMap: 'dist/assets/css/default.css.map', 
        //sourceMapRoot: 'src/assets/sass/',
        //outFile: 'dist/assets/css',
        outputStyle: 'nested', 
        imagePath: "../img/",
        precision: 2,
      }
    },

    sass_globbing: {
      dev: {
        files: {
          '_source/assets/sass/globbing/_variables.scss': '_source/assets/sass/variables/**/*.scss', // handled manually
          '_source/assets/sass/globbing/_base.scss': '_source/assets/sass/base/**/*.scss',
          '_source/assets/sass/globbing/_abstractions.scss': '_source/assets/sass/abstractions/*.scss',
          '_source/assets/sass/globbing/_components.scss': '_source/assets/sass/components/**/*.scss',
          '_source/assets/sass/globbing/_pages.scss': '_source/assets/sass/pages/**/*.scss',
        },
      },
      options: {
        useSingleQuotes: false
      }
    },



    autoprefixer: {

        options: {
          browsers: ['last 2 versions', 'ie >= 9']
        },

        dev: {
            files: {
                '_source/assets/css/default.css': '_source/assets/css/default.css',
            },
        },
    },
/*
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
*/
    clean: {
      dist: {
        src: ['dist/*', '!dist/.htaccess'],
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true, 
            cwd: '_source/assets/fonts/', 
            src: ['*.{svg,woff,eot,ttf}'],
            //src: ['cc-icons.*'],
            dest: 'dist/assets/fonts/',
          },
          /*
          {
            expand: true, 
            cwd: '_source/assets/js/libs/', 
            src: ['jquery-*.js'],
            dest: 'dist/assets/js/libs/',
          },
          */
          {
            expand: true,
            flatten: true,
            src: '_source/CHANGELOG.txt',
            dest: 'dist/',
          }
        ],
      },

    },

    useminPrepare: {
      html: 'dist/frontpage.html',
      options: {
          dest: 'dist/'
      }
    },

    usemin: {
      html: 'dist/*.html',
      options: {
          assetsDirs: [
            'dist/assets/',
            'dist/assets/img',
            'dist/assets/fonts',
          ]
      }
    },


    replace: {
      html: {
        options: {
          patterns: [
            {
              match: /(\.tmp\/concat\/assets\/|\.\.\/_source\/assets\/|_source\/assets\/|assets\/)/g,
              //replacement: 'http://git.krympevaerk.dk/coloplast_cc/dist/assets/',
              replacement: 'assets/',
              //replacement: '/magnetix/coloplast/dist/assets/',
            },
          ]
        },
        files: [
          {
            expand: true, 
            //flatten: true, 
            cwd: 'dist',
            src: ['**/*.html'],
            dest: 'dist/.'
          }
        ]
      },
      css: {
        options: {
          patterns: [
            {
              match: /(\.tmp\/concat\/assets\/|\.\.\/_source\/assets\/|_source\/assets\/|assets\/)/g,
              replacement: '../',
            },
          ]
        },
        files: [
          {
            expand: true, 
            //flatten: true, 
            cwd: 'dist',
            src: ['**/*.css'],
            dest: 'dist/.'
          }
        ]
      },
    },


  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', 'assemble']).forEach(grunt.loadNpmTasks);

  // Default task(s).
  grunt.registerTask('common', ['assemble', 'sass:dev', 'autoprefixer']);

  grunt.registerTask('default', ['common', 'watch']);

  // Build minified assets
  grunt.registerTask('build', [
    'clean:dist',
    'common',
    'htmlmin', 
    'prettify', 
    'imagemin',
    'svgmin',
    'copy:dist',
    'useminPrepare', 
/*
    'concat:js',
    'cssmin',
    'uglify:js',
*/
    'concat',
    'cssmin',
    'uglify',
    'usemin',
    'replace:html',
    'replace:css'
  ]);

};