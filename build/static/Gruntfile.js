module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    'output-style': 'compressed',
                    'sass-dir': 'sass',
                    'css-dir': 'css'
                }
            }
        },
        parallel: {
            mix: {
                tasks: [{
                grunt: true,
                args: ['fast']
                }, {
                grunt: true,
                args: ['block']
                }, {
                cmd: 'pwd'
                },{
                grunt: true,
                args: ['fast']
            }]
            },
            shell: {
                tasks: [{
                cmd: 'whoami'
                }]
            },
            grunt: {
                options: {
                grunt: true
                },
                tasks: ['fast', 'block', 'fast']
            },
            stream: {
                options: {
                stream: true
                },
                tasks: [ { cmd: 'tail', args: ['-f', '/var/log/system.log'] }]
            }
        },
        concat: {
            dist: {
                src: [
                    'js/libs/bootstrap/dist/js/bootstrap.js',
                    'js/libs/modernizr/modernizr.js',
                    'js/libs/jquery.transit/jquery.transit.js',
                    'js/dev/script.js'
                ],
                dest: 'js/build/script.js'
            }
        },
        uglify: {
            build: {
                src: 'js/build/script.js',
                dest: 'js/build/script.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'dev/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img'
                    }]
            }
        },
        watch: {
            scripts: {
                files: ['js/dev/script.js',
                    'js/dev/audio.js',
                    'js/dev/title-case.js'
                ],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            css: {
                files: 'sass/*.scss',
                tasks: ['compass']
            },
            images: {
                files: 'img/*',
                tasks: ['imagemin']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: 'css/*.css'
                },
                options: {
                    watchTask: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-parallel');

    // What tasks should be run when "grunt" is entered in the command line
    grunt.registerTask('default', ['watch']);

    // browsersync wasn't working
    //grunt.registerTask('default', ['browserSync', 'watch']);
};
