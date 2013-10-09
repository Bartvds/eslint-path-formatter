/*jshint node:true*/

describe('tool output', function () {

	var formatter = require("../index");
	formatter.color(false);

	var grunt = require('grunt');
	var assert = require('chai').assert;
	var tests = [
		{
			 name: 'Gruntfile-eslint-grunt.txt'
		 },
		{
			name: 'Gruntfile-grunt-eslint.txt'
		},
		{
			name: 'Gruntfile-eslint-cli.txt'
		}
	];

	tests.forEach(function (test) {
		it('should format when used in: ' + test.name, function () {
			var actual = grunt.file.read('test/fixtures/' + test.name);
			var expected = grunt.file.read('test/tmp/' + test.name);
			assert.strictEqual(actual, expected, test.name);
		});
	});
});
