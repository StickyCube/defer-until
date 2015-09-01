'use strict';

var _ = require('underscore');

_.mixin({
    isValue: function (v) {
        return v !== undefined && v !== null;
    },

    toArray: function (v, idx) {
        return Array.prototype.slice.call(v, idx);
    }
});

exports = module.exports = require('./src');
