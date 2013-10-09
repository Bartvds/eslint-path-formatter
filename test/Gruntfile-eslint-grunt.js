module.exports = function (grunt) {
	'use strict';

	grunt.loadTasks('../node_modules/eslint-grunt/tasks');

	grunt.initConfig({
		eslint: {
			eslint_grunt: {
				options: {
					config: 'eslint-test.json',
					formatter: '../index.js'
				},
				files: {
					src: ['fixtures/basic/invalid*.js']
				}
			}
		}
	});
	grunt.registerTask('default', ['eslint']);
};
