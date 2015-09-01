'use strict';

var fs = require('fs');

module.exports = function (klass) {
    var files;

    files = fs.readdirSync(__dirname);
    files.splice(files.indexOf('index.js'), 1);

    // Extend Condition using each file in this directory
    files.forEach(function (name) {
        require('./' + name)(klass);
    });
};
