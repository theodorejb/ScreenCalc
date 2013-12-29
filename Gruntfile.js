module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            dev: {                          // a particular target
                src: ['*.ts', 'test/*.ts'], // The source typescript files, http://gruntjs.com/configuring-tasks#files
                options: {                  // use to override the default options, http://gruntjs.com/configuring-tasks#options
                    module: 'commonjs',     // 'amd' (default) | 'commonjs'
                    sourceMap: true,        // true (default) | false
                    declaration: true,      // generate a declaration .d.ts file for every output js file. [true | false (default)]
                    removeComments: false   // true (default) | false
                },
            }
        },
        browserify: {
            dev: {
                src: ['test/test.js'],
                dest: 'test/browser/testbundle.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-browserify');

    // Default tasks
    grunt.registerTask('default', ['ts:dev', 'browserify:dev']);
};
