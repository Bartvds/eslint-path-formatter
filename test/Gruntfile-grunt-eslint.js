module.exports = function (grunt) {
	'use strict';

	grunt.loadTasks('../node_modules/grunt-eslint/tasks');

	grunt.initConfig({
		eslint: {
			grunt_eslint: {
				options: {
					config: 'eslint-test.json',
					format: '../index.js'
				},
				files: {
					src: ['fixtures/basic/invalid*.js']
				}
			}
		}
	});
	grunt.registerTask('default', ['eslint']);
};
