const logger = require("./logger");

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
    logError
};