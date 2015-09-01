'use strict';

var _           = require('underscore'),
    Condition   = require('./condition'),
    Spy         = require('./spy');

module.exports = function (instance, methods) {
    if (!_.isArray(methods)) {
        methods = [methods];
    }

    return new Spy(instance, methods);
};

module.exports.extend = function (args) {
    Condition.extend(args);
};
