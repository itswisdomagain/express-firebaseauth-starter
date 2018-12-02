const Joi = require('joi');

const phoneNumberValidation = Joi.string().length(11).regex(/^\d+$/);
const emailValidation = Joi.string().email().lowercase();
const passwordValidation = Joi.string().min(6);

module.exports = {
    loginSchema: {
        email: emailValidation,
        password: passwordValidation
    },

    registerSchema: {
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: emailValidation,
        password: passwordValidation,
        phoneNumber: phoneNumberValidation
    }
}