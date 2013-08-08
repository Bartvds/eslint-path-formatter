/**
 * @fileoverview Path reporter
 * @author Bart van der Schoor
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
	assert = require("assert"),
	path = require("path"),
	formatter = require("../../index");

formatter.color(false);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatting").addBatch({

	"when passed a simple message": {

		topic: [
			{
				filePath: "foo.js",
				messages: [
					{
						message: "Unexpected foo.",
						line: 5,
						column: 10,
						ruleId: "foo"
					}
				]
			}
		],

		"should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message": function (topic) {
			var config = {
				rules: { foo: 2 }
			};

			var result = formatter(topic, config);
			assert.strictEqual(">> foo.js\nERROR at " + path.resolve("foo.js") + "(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file", result);
		},

		"should return a string in the format WARNING at filePath[line,col]\\n[ruleId] message": function (topic) {
			var config = {
				rules: { foo: 1 }
			};

			var result = formatter(topic, config);
			assert.strictEqual(">> foo.js\nWARNING at " + path.resolve("foo.js") + "(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file", result);
		}

	},

	"when passed a fatal error message with filePath": {

		topic: [
			{
				filePath: "foo.js",
				messages: [
					{
						fatal: true,
						message: "Unexpected foo.",
						line: 5,
						column: 10,
						ruleId: "foo"
					}
				]
			}
		],

		"should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message": function (topic) {
			var config = {};    // doesn't matter what's in the config for this test

			var result = formatter(topic, config);
			assert.strictEqual(">> foo.js\nERROR at " + path.resolve("foo.js") + "(5,10):\n[foo] Unexpected foo.\n\nESLint found 1 problem in 1 file", result);
		}
	},

	"when passed multiple messages with filePath": {
		topic: [
			{
				filePath: "path/to/foo.js",
				messages: [
					{
						message: "Unexpected foo.",
						line: 5,
						column: 10,
						ruleId: "foo"
					}
				]
			},
			{
				filePath: "path/for/bar.js",
				messages: [
					{
						message: "Unexpected bar.",
						line: 6,
						column: 11,
						ruleId: "bar"
					}
				]
			}
		],

		"should return a string with multiple formatted entries": function (topic) {
			var config = {
				rules: { foo: 2, bar: 1 }
			};

			var result = formatter(topic, config);

			var foo = 'path/to/foo.js';
			var bar = 'path/for/bar.js';
			var expected = ">> " + foo + "\nERROR at " + path.resolve(foo) + "(5,10):\n[foo] Unexpected foo."
			expected += "\n\n>> " + bar + "\nWARNING at " + path.resolve(bar) + "(6,11):\n[bar] Unexpected bar.\n\nESLint found 2 problems in 2 files"

			assert.strictEqual(expected, result);
		}

	}

}).export(module);
