/**
 * @fileoverview Path reporter
 * @author Bart van der Schoor
 */

/* jshint node:true */

function getMessageType(message, rules) {

	if (message.fatal || rules[message.ruleId] === 2) {
		return "Error";
	} else {
		return "Warning";
	}

}

var fs = require('fs');
var path = require('path');
var SourceMapConsumer = require("source-map").SourceMapConsumer;

// based on https://github.com/evanw/node-source-map-support
var cache = {};
function mapSourcePosition(position) {
	var base64 = false;
	var dataUrlPrefix = "data:application/json;base64,";
	var sourceMap = cache[position.source];
	if (!sourceMap && fs.existsSync(position.source)) {
		// Get the URL of the source map
		var fileData = fs.readFileSync(position.source, 'utf8');
		var match = /\/\/[#@]\s*sourceMappingURL=(.*)\s*$/m.exec(fileData);
		if (!match) {
			return position;
		}
		var sourceMappingURL = match[1];

		// Read the contents of the source map
		var sourceMapData;
		if (sourceMappingURL.slice(0, dataUrlPrefix.length).toLowerCase() === dataUrlPrefix) {
			// Support source map URL as a data url
			sourceMapData = new Buffer(sourceMappingURL.slice(dataUrlPrefix.length), "base64").toString();
			base64 = true;
		}
		else {
			// Support source map URLs relative to the source URL
			var dir = path.dirname(position.source);
			sourceMappingURL = path.resolve(dir, sourceMappingURL);

			if (fs.existsSync(sourceMappingURL)) {
				sourceMapData = fs.readFileSync(sourceMappingURL, 'utf8');
			}
		}
		sourceMap = {
			url: sourceMappingURL,
			base64: base64
		};
		cache[position.source] = sourceMap;

		if (sourceMapData) {
			sourceMap.map = new SourceMapConsumer(sourceMapData);
		}
	}

	// Resolve the source URL relative to the URL of the source map
	if (sourceMap && sourceMap.map) {
		var originalPosition = sourceMap.map.originalPositionFor(position);

		// Only return the original position if a matching line was found. If no
		// matching line is found then we return position instead, which will cause
		// the stack trace to print the path and line for the compiled file. It is
		// better to give a precise location in the compiled file than a vague
		// location in the original file.
		if (originalPosition.source !== null) {
			if (sourceMap.base64) {
				originalPosition.source = dataUrlPrefix + originalPosition.source;
			}
			else {
				originalPosition.source = path.resolve(path.dirname(sourceMap.url), originalPosition.source);
			}
			return originalPosition;
		}
	}

	return position;
}

module.exports = function (results, config) {
	var output = ""
		, total = 0
		, rules = config.rules || {}
		//, path = require("path")
		, dataUrlPrefix = "data:application/json;base64,";

	results.forEach(function (result, index) {

		var messages = result.messages;
		total += messages.length;

		if (index > 0) {
			output += "\n";
		}
		output += ">> " + result.filePath + "\n";

		messages.forEach(function (message) {

			var position = mapSourcePosition({source: result.filePath, line: message.line, column: message.column});

			output += getMessageType(message, rules).toLocaleUpperCase() + " at ";
			if (position.source.slice(0, dataUrlPrefix.length).toLowerCase() === dataUrlPrefix) {
				output += position.source;
			}
			else {
				output += path.resolve(position.source);
			}
			output += "[" + position.line + "," + position.column + "]";
			output += "\n[" + message.ruleId + "] " + message.message + "\n";
		});

	});

	output += "\n" + total + " " + (total === 1 ? "problem" : "problems");

	return output;
};
