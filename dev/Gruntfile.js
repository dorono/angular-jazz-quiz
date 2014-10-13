module.exports = function(grunt) {

    'use strict';

    /* Load grunt tasks automatically
     * This reads package.json for grunt devDependencies and adds them so you don't have to type out
     * grunt.loadNpmTask(some-grunt-plugin);
     * for every plguin required run a grunt task.
     */
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {
            app: '../prod',
            temp: '.tmp',
            cssSrc: 'sass',
            cssDest: 'css',
            jsSrc: 'js',
            jsDest: 'js',
            imgSrc: 'img',
            imgDest: 'img',
            bower: 'lib'
        },

        // Lint HTML files
        htmlhint: {
            app: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': false,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'style-disabled': true,
                    'img-alt-require': true,
                    'doctype-html5': false
                },
                src: ['../prod/index.html']
            }
        },

        // enable SASS and Compass
        compass: {
            all: {
                options: {
                    sassDir: '<%= config.cssSrc %>',
                    cssDir: '<%= config.temp %>/css',
                    relativeAsets: false,
                    assetCacheBuster: false
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dev: {
                expand: true,
                cwd: '<%= config.temp %>/css',
                src: '**/*.css',
                dest: '<%= config.temp %>/css',
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= config.jsSrc %>/{,*/}*.js',
                '!<%= config.jsSrc %>/lib.js',
                // remember to remove this line below once the app is all in place, we need app.js!
                '!<%= config.jsSrc %>/app.js',
                '!<%= config.app %>/<%= config.jsSrc %>/global.js'
            ]
        },


        // Concatenate all of our js files
        concat: {
            scripts: {
                files: {
                        '<%= config.app %>/<%= config.jsDest %>/global.js': [
                        // remember to make this line below pull up app.js
                        '<%= config.jsSrc %>/app-test.js',
                        '<%= config.jsSrc %>/controllers.js',
                        '<%= config.jsSrc %>/services.js'
                    ]
                }
            },
            lib: {
                files: {
                    '<%= config.app %>/<%= config.jsDest %>/lib.js': [
                        '<%= config.bower %>/jquery/dist/jquery.js',
                        '<%= config.bower %>/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                        '<%= config.bower %>/angular/angular.js',
                        '<%= config.bower %>/angular-route/angular-route.js'
                    ]
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    '<%= config.app %>/<%= config.jsDest %>/lib.js': ['<%= config.app %>/<%= config.jsDest %>/lib.js'],
                    '<%= config.app %>/<%= config.jsDest %>/global.js': ['<%= config.app %>/<%= config.jsDest %>/global.js']
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            tempImages: {
                expand: true,
                dot: true,
                cwd: '<%= config.imgSrc %>',
                dest: '<%= config.temp %>/img',
                src: ['**/*.{gif,jpeg,jpg,png}', '!**/sprites/**']
            },

            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.temp %>/css',
                dest: '<%= config.app %>/<%= config.cssDest %>/',
                src: '**/*.css',
                rename: function(dest, src) {
                    return dest + src.replace(/master.css/, 'global.css');
                }
            },

            scripts: {
                expand: true,
                dot: true,
                cwd: '<%= config.jsSrc %>',
                dest: '<%= config.app %>/<%= config.jsDest %>',
                src: ['**/*.js', '!*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            temp: {
                dot: true,
                src: [
                    '<%= config.temp %>'
                ]
            }
        },

        // remove all unused css
        uncss: {
            dist: {
                files: {
                    '<%= config.app %>/<%= config.cssDest %>/global.css': ['<%= config.app %>/**/*.html']
                }
            }
        },

        watch: {
            options: {
                debounceDelay: 500,
                livereload: true
            },
            gruntfile: {
                files: 'Gruntfile.js',
            },
            html: {
                files: '<%= config.app %>/**/*.{html,php}',
                tasks: ['htmlhint']
            },
            styles: {
                files: '<%= config.cssSrc %>/**/*.scss',
                tasks: ['compass', 'copy:styles']
            },
            scripts: {
                files: '<%= config.jsSrc %>/**/*.js',
                tasks: ['jshint', 'concat', 'copy:scripts']
            }
        }
    });

    grunt.registerTask('default', [
        'clean:temp',
        'htmlhint',
        'compass',
        'autoprefixer',
        'concat',
        'copy',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:temp',
        'htmlhint',
        'compass',
        'autoprefixer',
        'concat',
        'uglify',
        'copy',
        'jshint',
        'uncss'
    ]);
};