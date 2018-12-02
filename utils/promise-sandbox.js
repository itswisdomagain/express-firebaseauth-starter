const { SilentPromiseError } = require("silent-promise");
const logger = require("./logger");

module.exports = function(promiseAction) {
    return (req, res, ...args) => {
        promiseAction(req, res, ...args).catch(error => handleError(error, req, res));
    };
};

function handleError(error, req, res) {
    let detail, serverErrorMessage;
    if (error instanceof SilentPromiseError) {
        detail = error.error;
        serverErrorMessage = error.message;
    }
    else {
        detail = error.stack;
        serverErrorMessage = "Server error";
    }

    logger.error({ detail, path: req.path, method: req.method }, error.message);
    res.is.serverError(serverErrorMessage);
}

module.exports.handleError = handleError;