'use strict';


function DummyAdapter(dummyQueue) {
    this.dummyQueue = dummyQueue;
    dummyQueue.addAdapter(this);
}

DummyAdapter.prototype.start = function () {

}

DummyAdapter.prototype.stop = function () {

}

DummyAdapter.prototype.post = function (objectType, object) {
    this.dummyQueue.post(this, objectType, object)
}

DummyAdapter.prototype.setQueueListener = function (listener) {
    this.listener = listener;
}

DummyAdapter.prototype.objectArrived = function (objectType, object) {
    Object.keys(this.listener.reactionIdToObjectTypeToCallbackMap).forEach((key) => {
        if(key.includes(objectType)) {
            let parts=key.split('|');
            this.listener.onObjectReceived(parts[0],objectType,object);
        }
    });
}

module.exports = DummyAdapter;