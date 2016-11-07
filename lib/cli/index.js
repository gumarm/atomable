/*
The MIT License

Copyright (c) 2016 Google, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

// This file hooks up on require calls to transpile TypeScript.
const cli = require('ember-cli/lib/cli');
const UI = require('ember-cli/lib/ui');
const Watcher = require('ember-cli/lib/models/watcher');
const path = require('path');

Error.stackTraceLimit = Infinity;

module.exports = function (options) {

  // patch UI to not print Ember-CLI warnings (which don't apply to atomable)
  UI.prototype.writeWarnLine = function () { }

  // patch Watcher to always default to node, not checking for Watchman
  Watcher.detectWatcher = function (ui, _options) {
    var options = _options || {};
    options.watcher = 'node';
    return Promise.resolve(options);
  }

  const oldStdoutWrite = process.stdout.write;
  process.stdout.write = function (line) {
    line = line.toString();
    if (line.match(/ember-cli-(inject-)?live-reload/)) {
      // don't replace 'ember-cli-live-reload' on ng init diffs
      return oldStdoutWrite.apply(process.stdout, arguments);
    }
    line = line.replace(/ember-cli(?!.com)/g, 'atomable')
      .replace(/\bember\b(?!-cli.com)/g, 'atomable');
    return oldStdoutWrite.apply(process.stdout, arguments);
  };

  const oldStderrWrite = process.stderr.write;
  process.stderr.write = function (line) {
    line = line.toString()
      .replace(/ember-cli(?!.com)/g, 'atomable')
      .replace(/\bember\b(?!-cli.com)/g, 'atomable');
    return oldStderrWrite.apply(process.stdout, arguments);
  };

  options.cli = {
    name: 'atomable',
    root: path.join(__dirname, '..', '..'),
    npmPackage: 'atomable'
  };

  // ensure the environemnt variable for dynamic paths
  process.env.PWD = process.env.PWD || process.cwd();
  process.env.CLI_ROOT = process.env.CLI_ROOT || path.resolve(__dirname, '..', '..');

  return cli(options);
};