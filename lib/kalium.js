'use strict'

const log = require('ulog')('kalium:Kalium');
const uuid = require('uuid');

module.exports = Kalium;


function Kalium(adapter) {
    adapter.setQueueListener(this);
    this.reactionIdToObjectTypeToCallbackMap = {};
    this.queueAdapter = adapter;

}


Kalium.prototype.start = function () {
    this.queueAdapter.start();
    log.info("Kalium started :)");
};


Kalium.prototype.stop = function (object, objectType) {
    this.queueAdapter.stop();
    log.info("Kalium stopped :(");
};

Kalium.prototype.post = function (objectType, object)  {
    if (!object) {
        log.warn("Object is null or undefined. No object will be posted!");
        return;
    }
    if (!objectType) {
        log.warn("ObjectType is null or undefined. No object will be posted!");
        return;
    }

    log.debug("Posting object: " + object);
    this.queueAdapter.post(objectType, object);
};

Kalium.prototype.onObjectReceived = function (reactionId, objectType, object) {
    let callback = this.reactionIdToObjectTypeToCallbackMap[reactionId + '|' + objectType];
    if (!callback) {
        logger.info("[reactionId=" + reactionId + "] does not match any of the registered reactions");
        return;
    }
    try {
        callback(object);
    } catch (e) {
        log.error("Failed to invoke callback for [reactionId=" + reactionId + "]. Error:" + e);
    }
}


Kalium.prototype.on = function (objectType, callback, reactionId) {
    let id = reactionId ? reactionId : 'reaction_' + uuid.v4();
    this.reactionIdToObjectTypeToCallbackMap[id + "|" + objectType] = callback;
    log.info("Reaction was added. " +
        "[objectType=" + objectType + "],[reactionId=" + id + "]");
};

