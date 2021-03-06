#!/usr/bin/env node

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

'use strict';  // eslint-disable-line

process.title = 'atomable';

const chalk = require('chalk');

console.log(chalk.blue('                                    '));  // eslint-disable-line
console.log(chalk.blue('       __                 __   __   '));  // eslint-disable-line
console.log(chalk.blue(' ___ _/ /____  __ _ ___ _/ /  / /__ '));  // eslint-disable-line
console.log(chalk.blue("/ _ `/ __/ _ \\/  ' / _ `/ _ \\/ / -_)"));  // eslint-disable-line
console.log(chalk.blue('\\_,_/\\__/\\___/_/_/_\\_,_/_.__/_/\\__/ '));  // eslint-disable-line
console.log(chalk.blue('  Severless Microservice Framework'));  // eslint-disable-line
console.log(chalk.blue('  atomable.io, 1.0.0-beta.20'));  // eslint-disable-line
console.log(chalk.blue('                                    '));  // eslint-disable-line

const exit = require('exit');
const packageJson = require('../package.json');
const Leek = require('leek');


let cli;
cli = require('../index');  // eslint-disable-line
if ('default' in cli) {
  cli = cli.default;
}

function CustomLeek(options) {
  options.trackingCode = packageJson.trackingCode;  // eslint-disable-line
  options.globalName = packageJson.name;  // eslint-disable-line
  options.name = packageJson.name;  // eslint-disable-line
  options.version = packageJson.version;  // eslint-disable-line
  return new Leek(options);
}

cli({
  cliArgs: process.argv.slice(2),
  inputStream: process.stdin,
  outputStream: process.stdout,
  errorStream: process.stderr,
  Leek: CustomLeek,
}).then((result) => {
  const exitCode = typeof result === 'object' ? result.exitCode : result;
  exit(exitCode);
});

