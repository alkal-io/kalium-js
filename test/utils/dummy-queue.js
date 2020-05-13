'use strict';

function DummyQueue() {
    this.adapters = [];
}

DummyQueue.prototype.addAdapter = function (adapter) {
    this.adapters.push(adapter);
}

DummyQueue.prototype.post = function (from, objectType, object) {
    this.adapters.filter(adapter => adapter != from)
        .forEach(adapter => adapter.objectArrived(objectType, object));
}

module.exports = DummyQueue;