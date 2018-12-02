const { MongoClient } = require("mongodb");
const { silentCallback } = require("silent-promise");
const constants = require("../utils/constants");

let database;

async function setupDatabase() {
    const [error, client] = await silentCallback(MongoClient.connect)(process.env.MONGODB_URL, { useNewUrlParser: true });
    error.ifError("Connect to mongodb failed").thenStopExecution();
    database = client.db(constants.database.name);
}

module.exports = {
    setupDatabase,
    getDatabase() {
        return database;
    }
};