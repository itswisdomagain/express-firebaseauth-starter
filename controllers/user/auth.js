const FirebaseAuth = require("firebaseauth");
const firebaseAuth = new FirebaseAuth(process.env.FIREBASE_API_KEY);
const { bindTo, execSilentCallback } = require("silent-promise");
const constants = require('../../utils/constants');
const { trimUserProfile } = require('./profile')

module.exports = {
    async login(req, res) {
        const signInAsync = execSilentCallback(firebaseAuth.signInWithEmail, bindTo(firebaseAuth));
        const [authError, authResult] = await signInAsync(req.body.email, req.body.password);
        
        if (authError.getError()) {
            res.is.badRequest(401, authError.getError().message);
            return;
        }
    
        const db = require("../../config/db").getDatabase();
        const userCollection = db.collection(constants.database.collections.users);
        const findUserAsync = execSilentCallback(userCollection.findOne, bindTo(userCollection));
        const [findUserError, user] = await findUserAsync({ _id: authResult.user.id });

        findUserError.ifError("Failed to get user info from database").thenStopExecution();
    
        if (!user) {
            res.is.badRequest(403, "Invalid account");
        }
        else {
            res.is.ok({
                profile: trimUserProfile(user),
                refreshToken: authResult.refreshToken,
                token: authResult.token,
            });
        }
    },

    async register(req, res) {
        // register on firebase, then save to database
        const name = `${req.body.firstName} ${req.body.lastName}`;
        const registerAsync = execSilentCallback(firebaseAuth.registerWithEmail, bindTo(firebaseAuth));
        const [authError, authResult] = await registerAsync(req.body.email, req.body.password, name);

        if (authError.getError()) {
            res.is.badRequest(401, authError.getError().message);
            return;
        }

        const db = require("../../config/db").getDatabase();
        const userCollection = db.collection(constants.database.collections.users);
        const newUserInfo = req.body;
        delete newUserInfo.password;
        newUserInfo._id = authResult.user.id;
        newUserInfo.accountCreationDate = Date.now();

        const insertAsync = execSilentCallback(userCollection.insertOne, bindTo(userCollection));
        const [saveError] = await insertAsync(newUserInfo);
        saveError.ifError("Failed to save new user info to database").thenStopExecution();

        res.is.ok({
            profile: trimUserProfile(newUserInfo),
            refreshToken: authResult.refreshToken,
            token: authResult.token
        });
    }
}