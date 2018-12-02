const { Router } = require('express');
const sandbox = require("../utils/promise-sandbox");
const auth = require('../controllers/user/auth');

const userRoutes = Router();

/** authentication endpoints */
userRoutes.post('/login', sandbox(auth.login));
userRoutes.post('/register', sandbox(auth.register));

module.exports = userRoutes;