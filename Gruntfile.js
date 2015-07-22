module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                src: ['test/*.js'],
                dest: 'test/browser/testbundle.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify:dev']);
};
