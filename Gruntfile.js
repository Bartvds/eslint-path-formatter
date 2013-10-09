module.exports = function (grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-run-grunt');
	grunt.loadNpmTasks('eslint-grunt');

	var path = require('path');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: {
				options: {
					reporter: './node_modules/jshint-path-reporter',
					jshintrc: '.jshintrc'
				},
				src: [
					'Gruntfile.js',
					'index.js',
					'lib/**/*.js',
					'test/*.js',
					'test/fixtures*.js'
				]
			}
		},
		clean: {
			tmp: ['./tmp/**/*', './test/tmp/**/*']
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['./test/*.test.js']
			}
		},
		run_grunt: {
			test: {
				options: {
					log: false,
					expectFail: true,
					'no-color': true,
					process: function (res) {
						var p = path.resolve('./test/fixtures/basic') + path.sep;
						//why does .replace() only work once? weird
						var actual = res.res.stdout.split(p).join('{{full}}');
						grunt.file.write('./test/tmp/' + path.basename(res.src, path.extname(res.src)) + '.txt', actual);
					}
				},
				//node cli testing is messed up on windows (pure a node problem that is patched in grunt)
				//src: ['test/Gruntfile*.js', '!test/Gruntfile-eslint-cli.js' ]
				src: ['test/Gruntfile*.js']
			}
		},
		eslint: {
			demo: {
				options: {
					config: 'test/eslint-demo.json',
					formatter: 'index.js'
				},
				files: {
					src: ['test/fixtures/**/*.js']
				}
			}
		}
	});

	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'jshint:all']);

	grunt.registerTask('test', ['build', 'run_grunt:test', 'mochaTest:test']);
	grunt.registerTask('demo', ['eslint:demo']);

	grunt.registerTask('dev', ['demo']);

};