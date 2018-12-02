const logger = require("./logger");

function bindMethodsToObject(object, objClass) {
    Object.getOwnPropertyNames(objClass.prototype)
        .forEach(method => {
            if (method.startsWith('component')) {
                return;
            }

            object[method] = object[method].bind(object);
        });
}

function logError(error) {
    let detail;
    if (error.error) {
        detail = error.error;
    }
    else {
        detail = error.stack;
    }

    logger.error({ detail }, error.message);
}

module.exports = {
    logError,
    bindMethodsToObject
};