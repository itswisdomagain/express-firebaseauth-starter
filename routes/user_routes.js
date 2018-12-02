const { Router } = require('express');
const sandbox = require('../utils/promise-sandbox');
const { validateRequestBody } = require('../middleware');
const { loginSchema, registerSchema } = require('./validation_schemas');
const auth = require('../controllers/user/auth');

const userRoutes = Router();

/** authentication endpoints */
userRoutes.post('/login', validateRequestBody(loginSchema), sandbox(auth.login));
userRoutes.post('/register', validateRequestBody(registerSchema), sandbox(auth.register));

module.exports = userRoutes;