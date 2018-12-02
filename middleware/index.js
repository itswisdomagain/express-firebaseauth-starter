const Joi = require('joi');
const joiValidationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
    presence: 'required' // require fields by default
};

function responseHandlers(req, res, next) {
    res.is = {
        ok: data => {
            res.status(200).send(data);
        },

        badRequest: (code, message) => {
            let responseCode = code;
            if (code < 400 || code >= 500) {
                responseCode = 400;
            }
            res.status(responseCode).send({ code, message });
        },

        serverError: message => {
            res.status(500).send(message);
        }
    };

    next();
}

const validateRequestBody = (schema) => (req, res, next) => {
    const {error, value} = Joi.validate(req.body, schema, joiValidationOptions);
    if (error) {
        const errorMessage = error.details.map(({ message }) => message.replace(/['"]/g, '')).join(', ');
        res.is.badRequest(422, `Invalid request: ${errorMessage}`);
        return;
    }

    req.body = value;
    next();
}

module.exports = {
    responseHandlers,
    validateRequestBody
}