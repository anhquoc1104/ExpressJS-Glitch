let User = require("../models/users.models.js");
let Session = require("../models/sessions.models.js");

module.exports = async (req, res, next) => {
    let { userId, sessionId } = req.signedCookies;
    if (!userId && !sessionId) {
        let session = new Session();
        await session.save();
        res.cookie("sessionId", session._id, { signed: true });
    }
    if (sessionId) {
        res.locals.isSession = await Session.findById(sessionId);
    }

    //redirect Admin to route admin
    if (userId) {
        let user = await User.findById(userId);
        if (user.isAdmin === true) {
            res.redirect("/admin");
            return;
        }
    }

    next();
};
