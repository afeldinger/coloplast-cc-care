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

      sprites: {
        files: ['_source/assets/img/{sprites,sprites-2x}/*.png'],
        tasks: ['sprite'],
      },

      iconfonts: {
        files: ['_source/assets/fonts/icons/*.svg'],
        tasks: ['font'],
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
      all: ['_source/assets/js/{,**/}*.js', '!_source/assets/js/libs/**/*.js']
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
                src: ['**/*.svg'],
                dest: 'dist/assets/img/'
            }]
        }
    },

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
      /*
        options: {
          browsers: ['last 2 versions', 'ie>=9']
        },
      */
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
          src: ['*.{svg,woff,eot,ttf}'],
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
              match: /(\.\.\/_source\/assets\/|_source\/assets\/|assets\/)/g,
              replacement: 'http://git.krympevaerk.dk/coloplast_cc/dist/assets/',
            },
          ]
        },
        files: [
          {
            expand: true, 
            //flatten: true, 
            cwd: 'dist',
            src: ['**/*.{html,css}'],
            dest: 'dist/.'
          }
        ]
      },
    },


  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', 'assemble']).forEach(grunt.loadNpmTasks);

  // Default task(s).
  grunt.registerTask('default', ['assemble', 'compass:dist', 'autoprefixer']);

  // Build minified assets
  grunt.registerTask('build', [
    'clean:dist',
    'default',
    'htmlmin', 
    'prettify', 
    'imagemin',
    'svgmin',
    'concat',
    'cssmin',
    'uglify',
    'useminPrepare', 
    'usemin',
    'copy:dist',
    'replace:dist',

  ]);

};