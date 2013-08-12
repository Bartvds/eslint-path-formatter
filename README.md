# eslint-path-formatter

[![Build Status](https://secure.travis-ci.org/Bartvds/eslint-path-formatter.png?branch=master)](http://travis-ci.org/Bartvds/eslint-path-formatter) [![Dependency Status](https://gemnasium.com/Bartvds/eslint-path-formatter.png)](https://gemnasium.com/Bartvds/eslint-path-formatter) [![NPM version](https://badge.fury.io/js/eslint-path-formatter.png)](http://badge.fury.io/js/eslint-path-formatter)

> ESLint reporter that displays absolute error path with row/column on one line.

A console reporter cloned from [jshint-path-reporter](https://github.com/Bartvds/jshint-path-reporter) that is similar to the default output from JSHint, except the report displays absolute file paths with the row/column appended in a parsable format.

This allows convenient use of [ESLint](https://github.com/nzakas/eslint) from within tools that apply a filter RegExp to console views to turn error lines into clickable links to instantly navigate to the error location.

### Source-map

There is support for [source-map's](https://github.com/mozilla/source-map); if a `//@ sourceMappingURL` is found the reported error position is mapped to the original source file. This works great with output from compilers like [TypeScript](http://www.typescriptlang.org/) or build tools like [grunt-concat-sourcemap](https://github.com/kozy4324/grunt-concat-sourcemap).

### WebStorm

This reporter is tested and actively used in WebStorm with [eslint-grunt](https://github.com/iancmyers/eslint-grunt). For maximum effect have a output filter configured in its [edit-tool-dialog](https://www.jetbrains.com/webstorm/webhelp/edit-tool-dialog.html) of the tool you run, something like:

````
$FILE_PATH$[ \t]*[:;,\[\(\{<]$LINE$(?:[:;,\.]$COLUMN$)?.*
````

## Usage

Install from NPM
````
 $ npm install eslint-path-formatter
````

Then pass **the path to the module** as the formatter option (see the [ESLint docs](https://github.com/nzakas/eslint/tree/master/docs/command-line-interface)). It is a bit odd but this is how ESLint finds the module.  

### eslint-grunt

````js
grunt.initConfig({
	//..
	eslint: {
		options: {
			formatter: './node_modules/eslint-path-formatter'
		}),
		source: {
			//..
		}
	}
});
````

## Example output

> Looks very similar to [jshint-path-reporter](https://github.com/Bartvds/jshint-path-reporter):
>  
> WebStorm (with link filter and darcula theme):
> ![webstorm darcula](https://raw.github.com/Bartvds/jshint-path-reporter/master/media/example_output_webstorm.png)

## Options

### Globally disable ANSI colouring

For low-tech displays and pure text.

````js
require('eslint-path-formatter').color(false);
````
## History

* 0.1.0 - Cloned from [jshint-path-reporter](https://github.com/Bartvds/jshint-path-reporter)

## Build

Install development dependencies in your git checkout:
````
$ npm install
````

You need the global [grunt](http://gruntjs.com) command:
````
$ npm install grunt-cli -g
````

Build and run tests:
````
$ grunt
````

See the `Gruntfile` for additional commands.

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.

