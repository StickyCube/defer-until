'use strict';

var _               = require('underscore'),
    util            = require('util'),
    EventEmitter    = require('events').EventEmitter;

/**
 * Return a property in an object, if the property is a function, it's context will be bound
 * @param  {Any} instance       The parent instance
 * @param  {String} property    A dot-seperated property name
 * @return {Any}                The value corresponding to the instance's property
 */
function getProperty (instance, property) {
    var next;

    return property.split('.').reduce(function (obj, prop) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        next = obj[prop];

        if (_.isFunction(next)) {
            next = next.bind(obj);
        }

        return next;
    }, instance);
}

function Condition (target, property) {

    EventEmitter.call(this);

    this.called = function () {
        this.emit('called');
    };

    this.target = function () {
        var t = target;

        if (_.isString(property) && property !== '') {
            t = getProperty(target, property);
        }

        return t;
    };
}

util.inherits(Condition, EventEmitter);

Condition.extend = function (extension) {

    _.forEach(extension, function (predicate, name) {
        Condition.prototype[name] = function (value, options) {
            var self = this,
                timer,
                test;

            options = options || {};

            test = function () {
                if (predicate(self.target(), value, options)) {
                    self.emit('satisfied');
                    clearInterval(timer);
                }
            };

            if (!options.poll) {
                return this.on('called', test);
            }

            timer = setInterval(test, options.poll);
        };
    });
};

require('./conditions')(Condition);

exports = module.exports = Condition;
