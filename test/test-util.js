'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function SuperTest () {
    this.foo = [];

    this.bar = 1;

    this.baz = false;

    this.fizz = function () {
        return this.baz;
    };

    this.work = function (v) {
        this.foo.push(v);
    };

    this.add = function () {
        this.bar += 1;
    };

    this.take = function () {
        this.bar -= 1;
    };
}

module.exports.SuperTest = SuperTest;

function TestEmitter () {
    EventEmitter.call(this);

    this.done = function () {
        this.emit('done');
    };
}

util.inherits(TestEmitter, EventEmitter);

module.exports.Emitter = TestEmitter;
