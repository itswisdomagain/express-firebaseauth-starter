const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { responseHandlers } = require('../middleware');

const app = express();

// setup middlewares
app.use(cors());
// setup custom response methods
app.use(responseHandlers);
// body-parser
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

module.exports = app;