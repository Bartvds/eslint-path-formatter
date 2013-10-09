module.exports = function (grunt) {
	'use strict';

	grunt.loadTasks('../node_modules/grunt-shell/tasks');

	//var path = require('path');

	grunt.initConfig({
		shell: {
			eslint: {
				command: function () {
					var cmd = ['node'];
					cmd.push('../node_modules/eslint/bin/eslint.js');
					cmd.push('-c', 'eslint-test.json');
					cmd.push('-f', '../index.js');
					cmd.push('fixtures/basic/invalid-a.js');
					cmd.push('fixtures/basic/invalid-b.js');

					//console.log(cmd);
					//console.log(cmd.join(' '));

					return cmd.join(' ');
				},
				options: {
					execOptions: {
						cwd: '.'
					},
					stdout: true
				}
			}
		}
	});
	grunt.registerTask('default', ['shell:eslint']);
};
