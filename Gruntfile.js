/* eslint-env node */

// eslint-disable-next-line no-undef
module.exports = function(grunt) {
    let path = require('path'),
        cwd = process.env.PWD || process.cwd();
    let amdSrc = ['**/amd/src/*.js'];
    let amdDest = ['**/amd/build/*.min.js'];
    let uglifyRename = function(destPath, srcPath) {
        destPath = srcPath.replace('src', 'build');
        destPath = destPath.replace('.js', '.min.js');
        destPath = path.resolve(cwd, destPath);
        return destPath;
    };
    let babelRename = function(destPath, srcPath) {
        destPath = srcPath.replace('src', 'build');
        destPath = destPath.replace('.js', '.min.js');
        return destPath;
    };
    let files = null;
    if (grunt.option('files')) {
        // Accept a comma separated list of files to process.
        files = grunt.option('files').split(',');
    }
    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    require("grunt-load-gruntfile")(grunt);
    grunt.loadGruntfile("../../Gruntfile.js");

    // Load all grunt tasks.
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.initConfig({
        watch: {
            // If any .less file changes in directory "less" then run the "less" task.
            files: "less/*.less",
            tasks: ["less"]
        },
        less: {
            // Production config is also available.
            development: {
                options: {
                    // Specifies directories to scan for @import directives when parsing.
                    // Default value is the directory of the source, which is probably what you want.
                    paths: ["less/"],
                    compress: true
                },
                files: {
                    "styles.css": "less/styles.less"
                }
            },
        },
        eslint: {
            // Even though warnings dont stop the build we don't display warnings by default because
            // at this moment we've got too many core warnings.
            // {quiet: !grunt.option('show-lint-warnings')}
            options: {quiet: !grunt.option('show-lint-warnings')},
            amd: {src: amdSrc, dest: amdDest},
            // Check YUI module source files.
            yui: {src: ['**/yui/src/**/*.js', '!*/**/yui/src/*/meta/*.js']}
        },
        uglify: {
            amd: {
                files: [{
                    expand: true,
                    src: amdSrc,
                    rename: uglifyRename
                }],
                options: {report: 'none'}
            }
        },
        babel: {
            options: {
                sourceMaps: true,
                comments: false,
                plugins: [
                    'transform-es2015-modules-amd-lazy',
                    'system-import-transformer',
                    // This plugin modifies the Babel transpiling for "export default"
                    // so that if it's used then only the exported value is returned
                    // by the generated AMD module.
                    //
                    // It also adds the Moodle plugin name to the AMD module definition
                    // so that it can be imported as expected in other modules.
                    //path.resolve('babel-plugin-add-module-to-define.js'),
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-syntax-import-meta',
                    ['@babel/plugin-proposal-class-properties', {'loose': false}],
                    '@babel/plugin-proposal-json-strings'
                ],
                presets: [
                    ['minify', {
                        // This minification plugin needs to be disabled because it breaks the
                        // source map generation and causes invalid source maps to be output.
                        simplify: false,
                        builtIns: false
                    }],
                    ['@babel/preset-env', {
                        targets: {
                            browsers: [
                                ">0.25%",
                                "last 2 versions",
                                "not ie <= 10",
                                "not op_mini all",
                                "not Opera > 0",
                                "not dead"
                            ]
                        },
                        modules: false,
                        useBuiltIns: false
                    }]
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    src: files ? files : amdSrc,
                    rename: babelRename
                }]
            }
        },
    });
    // The default task (running "grunt" in console).
    grunt.registerTask("default", ["less"]);
};