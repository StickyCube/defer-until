'use strict';

var
    expect = require('chai').expect,
    SuperTest = require('./test-util').SuperTest,
    queue = require('../index'),
    obj;

describe('Is', function () {

    beforeEach(function () {
        obj = new SuperTest();
    });

    it('Should not invoke `obj.work` until `obj.bar` is 3 - no poll', function () {
        queue(obj, 'work').until(obj, 'bar').is(3);

        obj.work(1);
        obj.work(2);

        expect(obj.foo).to.deep.equal([]);

        obj.bar = 3;

        expect(obj.foo).to.deep.equal([]);

        obj.work(3);

        expect(obj.foo).to.deep.equal([1, 2, 3]);
    });

    it('Should not invoke `obj.work` until `obj.bar` is 3 - with poll', function (done) {
        queue(obj, 'work').until(obj, 'bar').is(3, { poll: 100 });

        obj.work(1);
        obj.work(2);
        obj.work(3);

        expect(obj.foo).to.deep.equal([]);

        obj.bar = 3;

        setTimeout(function () {
            expect(obj.foo).to.deep.equal([1, 2, 3]);
            done();
        }, 200);
    });
});
