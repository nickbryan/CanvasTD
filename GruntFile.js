module.exports = function(grunt) {

    var sourceFiles = grunt.file.readJSON("sourceFiles.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [sourceFiles]
        },
        concat: {
            dist: {
                src: [sourceFiles],
                dest: 'build/CanvasTD.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                src: [sourceFiles],
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            scripts: {
                files: [sourceFiles],
                tasks:['jshint','concat','uglify']
            },
            options: {
                spawn: false,

            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
