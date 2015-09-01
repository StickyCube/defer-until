'use strict';

var bind        = require('bind-plus'),
    _           = require('underscore'),
    Condition   = require('./condition');

function Spy (instance, methods) {
    var condition,
        invoked = false,
        originals = {},
        queues = {};

    function override (method, original) {
        var args = _.toArray(arguments, 2),
            call = bind(original, instance, args);

        queues[method].push(call);

        if (condition && !invoked) {
            condition.called();
        }

        return instance;
    }

    function invoke () {
        var call;

        invoked = true;

        _.forEach(queues, function (queue) {
            while (call = queue.shift()) {
                call();
            }
        });

        _.forEach(methods, function (method) {
            instance[method] = originals[method];
            delete originals[method];
            delete queues[method];
        });
    }

    this.until = function (target, property) {
        condition = new Condition(target, property);

        condition.on('satisfied', function () {
            invoke();
        });

        return condition;
    };

    // Initialise data for each method
    _.forEach(methods, function (method) {
        originals[method] = instance[method];
        instance[method] = override.bind(this, method, originals[method]);
        queues[method] = [];
    }, this);
}

exports = module.exports = Spy;
