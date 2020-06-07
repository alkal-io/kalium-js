'use strict'
const log = require('pino')({
    prettyPrint: true, name: 'Kalium'
});

const uuid = require('uuid');

class Kalium {
    constructor(adapter) {
        adapter.setQueueListener(this);
        this.reactionIdToObjectTypeToCallbackMap = {};
        this.queueAdapter = adapter;
    }

    start() {
        this.queueAdapter.start();
        log.info("Kalium started :)");
    }

    stop() {
        this.queueAdapter.stop();
        log.info("Kalium stopped :(");
    }

    post(objectType, object) {
        if (!object) {
            log.error("Object is null or undefined. No object will be posted!");
            return;
        }
        if (!objectType) {
            log.error("ObjectType is null or undefined. No object will be posted!");
            return;
        }

        log.debug("Posting object: " + object);
        this.queueAdapter.post(objectType, object);
    }

    onObjectReceived(reactionId, objectType, object) {
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

    on(objectType, callback, reactionId) {
        let id = reactionId ? reactionId : 'reaction_' + uuid.v4();
        this.reactionIdToObjectTypeToCallbackMap[id + "|" + objectType] = callback;
        log.info("Reaction was added. " +
            "[objectType=" + objectType + "],[reactionId=" + id + "]");
    };


}


module.exports = Kalium;