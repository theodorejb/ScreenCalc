module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            pub: {
                src: ['lib/*.ts', 'test/*.ts'],
                options: {
                    module: 'commonjs',    // use commonjs instead of amd
                    sourceMap: true,       // useful for debugging
                    declaration: true,     // generate a declaration .d.ts file for every output js file
                    removeComments: false,
                },
            },
        },
        browserify: {
            dev: {
                src: ['test/*.js'],
                dest: 'test/browser/testbundle.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-browserify');

    // see http://gruntjs.com/creating-tasks
    grunt.registerTask('default', ['ts:pub', 'browserify:dev']);
    grunt.registerTask('pub', ['ts:pub', 'browserify:dev']);
};
