module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            pub: {
                src: ['lib/*.ts', 'test/*.ts'],
                options: {
                    module: 'commonjs',   // 'amd' (default) | 'commonjs'
                    sourceMap: false,      // true (default) | false
                    declaration: true,    // generate a declaration .d.ts file for every output js file. [true | false (default)]
                    removeComments: false // true (default) | false
                },
            },
            dev: {
                src: ['lib/*.ts', 'test/*.ts'],
                options: {
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false,
                    removeComments: false
                },
            }
        },
        browserify: {
            dev: {
                src: ['test/*.js'],
                dest: 'test/browser/testbundle.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-browserify');

    // see http://gruntjs.com/creating-tasks
    grunt.registerTask('default', ['ts:dev', 'browserify:dev']);
    grunt.registerTask('pub', ['ts:pub', 'browserify:dev']);
};
