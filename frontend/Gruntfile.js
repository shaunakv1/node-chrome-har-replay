module.exports = function(grunt) {

    var pk = grunt.file.readJSON('package.json');

    // Project configuration.
    var gruntConf = {
        pkg: grunt.file.readJSON('package.json'),

        //Combine JavaScript files
        concat: {
            options: {
                separator: ';\n',
            },
            dist: {
                src: require('./js/har-performance-monitor.json'),
                dest: 'js/har-performance-monitor.js'
            },
        },

        //Compile and minify Less files
        less: {
            development: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/har-performance-monitor.css": "css/less/har-performance-monitor.less"
                }
            }
        },

        //Minify compiled css
        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/',
                src: 'har-performance-monitor.css',
                dest: 'css/',
                ext: '.min.css'
            }
        },

        clean: {
             build: ["css/har-performance-monitor.css"]
           },

        cachebreaker: {
            dev: {
                options: {
                    match: ['har-performance-monitor.js', 'har-performance-monitor.min.css'],
                },
                files: {
                    src: ['index.html']
                }
            }
        },

        watch: {
            //watch js files
            js: {
                files: ['js/*/*.js', 'js/lib/*.js','js/har-performance-monitor.json'],
                tasks: ['concat','cachebreaker']
            },
            //watch less files
            css: {
                files: ['css/less/*.less'],
                tasks: ['less:development', 'cssmin:minify','clean','cachebreaker'],
            },
            html: {
                files: ['*.html', 'partials/*.html'],
            },
            options: {
                livereload: false,
            }
            // Livereload browser

        } //end watch task

    };
    grunt.initConfig(gruntConf); // close grunt initconfig function

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-contrib-uglify');

    //Load the plugin that provides the 'JS Combine' task
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-concat-sourcemaps');

    //Load the plugin that provides the 'JS Uglify' task
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    //Load the plugin that provides the "LESS" task.
    grunt.loadNpmTasks('grunt-contrib-less');

    //Load the plugin that provides the "cssmin" task
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //Load the plugin that provides the "watch" task.
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Load the plugin that adds timestamps to css and js includes to break cache
    grunt.loadNpmTasks('grunt-cache-breaker');

    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['concat','less', 'cssmin','clean', 'watch']);

};