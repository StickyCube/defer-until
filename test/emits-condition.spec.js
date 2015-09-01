'use strict';

var
    expect = require('chai').expect,
    SuperTest = require('./test-util').SuperTest,
    Emitter = require('./test-util').Emitter,
    queue = require('../index'),
    emitter,
    obj;

describe('Emits', function () {

    beforeEach(function () {
        emitter = new Emitter();
        obj = new SuperTest();
    });

    it('Should not invoke `obj.work` until emitter emits `done`', function () {
        queue(obj, 'work').until(emitter).emits('done');

        obj.work(1);
        obj.work(2);
        obj.work(3);

        expect(obj.foo).to.deep.equal([]);

        emitter.done();

        expect(obj.foo).to.deep.equal([1, 2, 3]);
    });

    it('Should not invoke `obj.work` or `obj.add` until emiiter emits `done`', function () {
        queue(obj, ['work', 'add']).until(emitter).emits('done');

        obj.work(1);
        obj.work(2);
        obj.take();
        obj.add();
        obj.add();

        expect(obj.foo).to.deep.equal([]);
        expect(obj.bar).to.equal(0);

        emitter.done();

        expect(obj.foo).to.deep.equal([1, 2]);
        expect(obj.bar).to.equal(2);
    });
});
