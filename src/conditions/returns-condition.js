'use strict';

var equal = require('deep-equal');

module.exports = function (Condition) {
    Condition.extend({
        returns: function (actual, value, options) {
            if (options.deep) {
                return equal(actual(), value);
            }

            return actual() === value;
        }
    });
};
