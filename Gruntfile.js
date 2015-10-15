module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        connect: {
            dist: {
                port: 9970,
                base: './dist/'
            },
            build: {
                port: 9971,
                base: './build/'
            }
        },
        watch: {
            all: {
                options: { livereload: 18180 },
                files: ['**/*.html','**/*.css','dist/js/*.js']
            },
            data: {
                files: ['data/*'],
                tasks: ['copy:data']
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
                files: ['src/sass/**/**/*.sass'],
                tasks: ['sass:dev','postcss:dev']//,'sass:port']
            }
        },
        copy: {
            data: {
                files: [{
                    expand: true,
                    src: ['data/*'],
                    dest: 'dist/'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.html','data/*','README.md'],
                    dest: 'build'
                }]
            }
        },
        babel: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['*.js'],
                    dest: 'dist/js',
                    ext: '.js'
                }]
            },
            modules: {
                files: {
                    'dist/js/modules.js': ['src/js/modules/index.dev.js']
                }
            },
            build: {
                files: {
                    '.temp/js/index-build.js': ['src/js/index-build.js']
                }
            }
        },
        concat: {
            dev: {
                options: {
                    seperator: '// END FILE'
                },
                files: {
                    'src/js/modules/index.dev.js': ['src/js/modules/dynamicID.mod.js','src/js/modules/Console.mod.js'],
                    'dist/js/d3.lib.js': ['node_modules/d3/d3.js','node_modules/runeJS/rune.js'],
                    'dist/js/ui.lib.js': ['node_modules/jquery/dist/jquery.js','node_modules/react/dist/react.js'],
                }
            },
            build: {
                options: {
                    seperator: '// END FILE'
                },
                files: {
                    'src/js/index-build.js': ['src/js/d3-test.js']
                }
            }
        },
        jade: {
            md: [{
                expand: true,
                cwd: './',
                src: ['*.md.jade'],
                dest: 'dist',
                ext: '.html'
            }],
            dev: {
                options: {},
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.jade'],
                    dest: 'dist',
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
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            },
            port: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            },
            build: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css'],
                    dest: 'build/css/',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            dev: {
                options: {
                    map: {
                        inline: false,
                        annotation: 'dist/css/maps/'
                    },
                    processors: [
                        //require('autoprefixer')({})
                    ]
                },
                dist: {
                    src: 'dist/css/*'
                    //src: '.tmp/css/*.css'
                }
            },
            build: {
                options: {
                    map: false,
                    processors: [
                        //require('cssnano')()
                    ]
                },
                dist: {
                    src: 'build/css/*.css'
                }
            }
        },
        webpack: {
            build: {
                entry: '.temp/js/index-build.js',
                output: {
                    path: 'build/js/',
                    filename: 'index.js'
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                temp: {
                    files: {
                        expand: true,
                        cwd: '.temp/js',
                        src: '!(index-build).js',
                        dest: 'dist/js/'
                    }
                }
            },
            build: {
                options: {
                    mangle: true
                },
                files: {
                    'build/js/index.js': ['.temp/js/index-build.js']
                }
            }
        },
        'regex-replace': {
            build: {
                src: ['build/*.html'],
                actions: [
                    {
                        name: 'Remove livereload link',
                        search: '<script src="//localhost:18180/livereload.js"></script>',
                        replace: '',
                        flags: 'g'
                    }
                ]
            }
        }
    });

    // Boilerplate View Setup
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Transformers
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Processors
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('autoprefixer');
    grunt.loadNpmTasks('cssnano');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regex-replace')


    // Default task
    grunt.registerTask('default',['connect:dist','copy:data','concat:dev','watch','babel:dev','babel:modules','uglify:dist','jade:dev','sass:dev','postcss:dev']);
    grunt.registerTask('build',['sass:build','concat:build','babel:build','uglify:build','copy:build','regex-replace:build','connect:build']);
};

