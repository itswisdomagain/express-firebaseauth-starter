
/**
 * Used to remove unneccessary fields from profile object before sending in response
 * @param {*} profile - user object from database
 */
function trimUserProfile(profile) {
    delete profile._id;
    return profile;
}

module.exports = {
    trimUserProfile
}