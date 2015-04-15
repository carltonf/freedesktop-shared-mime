#!/usr/bin/env node

var mime = require('./index.js');
var input = process.argv[2];
var type = mime.lookup(input);

process.stdout.write(type + '\n');
