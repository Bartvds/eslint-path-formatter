/**
 * @fileoverview Path reporter
 * @author Bart van der Schoor
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
	assert = require("assert"),
	fs = require("fs"),
	path = require("path"),
	cli = require("eslint").cli;

require('../../index.js').color(false);

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var formatter = './index.js';
var fixtures = "tests/fixtures";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var log = console.log;
var captureLog = function () {
	var buffer = [];
	console.log = function (text) {
		text = '' + text;
		buffer.push(text.replace("\r\n", "") + "\n");
	};
	var getLog = function () {
		console.log = log;
		return buffer.join('');
	};
	getLog.peek = function () {
		return buffer.join('')
	};
	return getLog;
};

var pathSeperator = path.sep ? path.sep : (process.platform === "win32" ? "\\" : "/");

var escape = function(str) {
	str = str.replace(/ /g, '/s');
	str = str.replace(/\t/g, '\\t');
	str = str.replace(/\r/g, '\\r');
	return str;
};

var runCliTest = function (commandArray, expectedExitCode, expectedOutput){

	var getLog = captureLog();
	var exitCode = cli.execute(commandArray);
	var buffer = getLog();

	buffer = "[" + escape(buffer) + "]";
	expectedOutput = "[" + escape(expectedOutput) + "]";
	assert.strictEqual(buffer, expectedOutput);
	assert.strictEqual(exitCode, expectedExitCode);
};

vows.describe("source-map").addBatch({

	"when enabled": {

		"on a coffeescript source-map with fileurl //# sourceMappingURL": {

			topic: [ "-f", formatter, "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-fileurl.js" ],

			"should return exitCode 0, with some problems and report positions in source files": function (topic) {

				var expected = fs.readFileSync(fixtures + "/source-map-coffee/enabled-path-fileurl.txt", "utf8");
				// apply local absolute path
				expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

				runCliTest(topic, 0, expected);
			}
		},

		"on a coffeescript source-map with dataurl //# sourceMappingURL": {

			topic: [ "-f", formatter, "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-dataurl.js" ],

			"should return exitCode 0, with some problems and report positions in source files": function (topic) {

				var expected = fs.readFileSync(fixtures + "/source-map-coffee/enabled-path-dataurl.txt", "utf8");

				runCliTest(topic, 0, expected);
			}
		},

		"on a coffeescript source-map with relative fileurl on path reporter": {

			topic: [ "-f", formatter, "-c", fixtures + "/source-map-relative/config.json", fixtures + "/source-map-relative/main.js" ],

			"should return exitCode 0, with some problems and report positions in source files": function (topic) {

				var expected = fs.readFileSync(fixtures + "/source-map-relative/path.txt", "utf8");
				// apply local absolute path to sibling directory
				expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

				runCliTest(topic, 0, expected);
			}
		},

		"on a typescript source-map with //@ sourceMappingURL and two source files": {

			topic: [ "-f", formatter, "-c", fixtures + "/source-map-typescript/config.json", fixtures + "/source-map-typescript/main.js" ],

			"should return exitCode 0, with some problems and report positions in source files": function (topic) {

				var expected = fs.readFileSync(fixtures + "/source-map-typescript/enabled-path.txt", "utf8");
				// apply local absolute path
				expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-typescript') + pathSeperator);

				runCliTest(topic, 0, expected);
			}
		}
	}/*,
    "when not enabled": {

        "on a coffeescript source-map with //# sourceMappingURL": {

            topic: [ "-f", formatter, "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-fileurl.js" ],

            "should return exitCode 0, with some problems and report positions in linted files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-coffee/disabled-path-fileurl.txt", "utf8");
                // apply local absolute path
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        },

        "on a typescript source-map with //@ sourceMappingURL and two source files": {

            topic: [ "-f", formatter, "-c", fixtures + "/source-map-typescript/config.json", fixtures + "/source-map-typescript/main.js" ],

            "should return exitCode 0, with some problems and report positions in linted files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-typescript/disabled-path.txt", "utf8");
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-typescript') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        }
    }*/
}).export(module);
