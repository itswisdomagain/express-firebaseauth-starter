const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// setup middlewares
app.use(cors());
// setup custom response methods
app.use(responseHandlers);
// body-parser
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

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

module.exports = app;