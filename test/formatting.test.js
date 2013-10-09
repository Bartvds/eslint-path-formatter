/*jshint node:true*/


describe('formatting', function () {

	var path = require('path');
	var formatter = require('../index');
	formatter.color(false);

	var assert = require('chai').assert;

	describe('when passed a simple message', function () {
		var message = [
			{
				filePath: 'foo.js',
				messages: [
					{
						message: 'Unexpected foo.',
						line: 5,
						column: 10,
						ruleId: 'foo'
					}
				]
			}
		];

		it('should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message', function () {
			var config = {
				rules: { foo: 2 }
			};

			var result = formatter(message, config);
			assert.strictEqual('>> foo.js\nERROR at ' + path.resolve('foo.js') + '(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file', result);
		});
		it('should return a string in the format WARNING at filePath[line,col]\\n[ruleId] message', function () {
			var config = {
				rules: { foo: 1 }
			};

			var result = formatter(message, config);
			assert.strictEqual('>> foo.js\nWARNING at ' + path.resolve('foo.js') + '(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file', result);
		});
	});

	describe('when passed a fatal error message with filePath', function () {
		var message = [
			{
				filePath: 'foo.js',
				messages: [
					{
						fatal: true,
						message: 'Unexpected foo.',
						line: 5,
						column: 10,
						ruleId: 'foo'
					}
				]
			}
		];

		it('should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message', function () {
			var config = {};    // doesn't matter what's in the config for this test

			var result = formatter(message, config);
			assert.strictEqual('>> foo.js\nERROR at ' + path.resolve('foo.js') + '(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file', result);
		});
	});

	describe('when passed multiple messages with filePath', function () {
		var message = [
			{
				filePath: 'path/to/foo.js',
				messages: [
					{
						message: 'Unexpected foo.',
						line: 5,
						column: 10,
						ruleId: 'foo'
					}
				]
			},
			{
				filePath: 'path/for/bar.js',
				messages: [
					{
						message: 'Unexpected bar.',
						line: 6,
						column: 11,
						ruleId: 'bar'
					}
				]
			}
		];

		it('should return a string with multiple formatted entries', function () {
			var config = {
				rules: { foo: 2, bar: 1 }
			};

			var result = formatter(message, config);

			var foo = 'path/to/foo.js';
			var bar = 'path/for/bar.js';
			var expected = '>> ' + foo + '\nERROR at ' + path.resolve(foo) + '(5,10):\n[foo] Unexpected foo.';
			expected += '\n\n>> ' + bar + '\nWARNING at ' + path.resolve(bar) + '(6,11):\n[bar] Unexpected bar.\n\nESLint found 2 problems in 2 files';

			assert.strictEqual(expected, result);
		});
	});

	describe('when passed multiple messages with filePath', function () {
		var message = [
			{
				filePath: 'path/to/foo.js',
				messages: [
					{
						message: 'Unexpected foo.',
						line: 5,
						column: 10,
						ruleId: 'foo'
					}
				]
			},
			{
				filePath: 'path/for/bar.js',
				messages: [
					{
						message: 'Unexpected bar.',
						line: 6,
						column: 11,
						ruleId: 'bar'
					}
				]
			}
		];

		it('should return a string with multiple formatted entries', function () {
			var config = {
				rules: { foo: 2, bar: 1 }
			};

			var result = formatter(message, config);

			var foo = 'path/to/foo.js';
			var bar = 'path/for/bar.js';
			var expected = '>> ' + foo + '\nERROR at ' + path.resolve(foo) + '(5,10):\n[foo] Unexpected foo.';
			expected += '\n\n>> ' + bar + '\nWARNING at ' + path.resolve(bar) + '(6,11):\n[bar] Unexpected bar.\n\nESLint found 2 problems in 2 files';

			assert.strictEqual(expected, result);
		});
	});
});
