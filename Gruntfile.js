module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        connect: {
            dist: {
                port: 9970,
                base: './dev'
                }
        },
        watch: {
            all: {
                options: { livereload: 18180 },
                files: ['**/*.html','**/*.css','**/**/*.json']
            },
            es6: {
                files: ['src/js/**/*'],
                tasks: ['concat:dev','babel:dev','babel:modules']
                },
            jade: {
                files: ['src/*.jade'],
                tasks: ['jade:dev']
                },
            sass: {
                files: ['src/sass/**/*.sass'],
                tasks: ['sass:dev','postcss:dev']//,'sass:port']
            }
        },
        babel: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['*.js'],
                    dest: 'dev/js',
                    ext: '.js'
                }]
            },
            modules: {
                files: {
                    'dev/js/modules.js':'src/js/modules/index.dev.js'
                }
            }
        },
        concat: {
            dev: {
                options: {
                    seperator: '// END FILE'
                },
                files: {
                    'src/js/modules/index.dev.js': ['src/js/modules/dynamicID.mod.js','src/js/modules/console.mod.js']
                }
            }
        },
        jade: {
            dev: {
                options: {},
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.jade'],
                    dest: 'dev',
                    ext: '.html'
                }]
            }
        },
        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['*.sass'],
                    dest: 'dev/css/',
                    //dest: '.tmp/css',
                    ext: '.css'
                }]
            },
            port: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css',
                    src: ['*.css'],
                    dest: 'dev/css',
                    ext: '.css'
                    }]
            }
        },
        postcss: {
            dev: {
                options: {
                    map: {
                        inline: false,
                        annotation: 'dev/css/maps/'
                    }//,
                   // processors: {
                        //require('autoprefixer')({})
                    //}
                },
                dist: {
                    src: 'dev/css/*'
                    //src: '.tmp/css/*.css'
                }
            },
            build: {
                options: {
                    map: false//,
                    //processors: {
                        //require('cssnano')(),
                        //require('postcss-discard-comments')()
                    //}
                },
                dist: {
                    src: 'dev/css/*.css',
                    dest: 'dist/css/'
                }
            }
        },
        webpack: {
            build: {
                entry: 'src/js/index.build.js',
                output: {}
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true
                },
                my_target: {}
            }
        }
    });

    // Boilerplate View Setup
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Transformers
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Processors
    grunt.loadNpmTasks('grunt-postcss');
    //grunt.loadNpmTasks('autoprefixer');
    //grunt.loadNpmTasks('cssnano');
    //grunt.loadNpmTasks('postcss-discard-comments');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    // Default task
    grunt.registerTask('default',['connect:dev','watch','concat:dev','babel:dev','babel:modules','jade:dev','sass:dev','postcss:dev']);
    grunt.registerTask('dev',[]);
    grunt.registerTask('build',['postcss:build','webpack:build','uglify:build','connect:build']);
};

