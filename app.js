require("dotenv").config();
const app = require("./config/express");
const { setupDatabase } = require("./config/db");
const logger = require("./utils/logger");
const { handleError } = require("./utils/promise-sandbox");
const routes = require('./routes');

// mount routes
app.get('/', (req, res) => res.is.ok('Hello world'));
app.use('/user', routes.userRoutes);

// catch all trickled down errors
app.use((err, req, res, next) => {
    handleError(err, req, res);
});

setupDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`API running on port ${process.env.PORT}`);
        });
    })
    .catch(error => {
        logger.error({ detail: error.stack || error, path: "app.js", method: "setupDatabase" }, "Failed to start server. Error setting up database");
    });