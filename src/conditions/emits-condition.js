'use strict';

module.exports = function (Condition) {

    // Emits cannot be done through the extend API
    Condition.prototype.emits = function (signal) {
        var self = this,
            target = this.target();

        target.on(signal, function () {
            self.emit('satisfied');
        });
    };
};
