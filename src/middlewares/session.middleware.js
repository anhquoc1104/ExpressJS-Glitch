let User = require("../models/users.models.js");
let Session = require("../models/sessions.models.js");

module.exports = async (req, res, next) => {
    let { userId } = req.signedCookies;
    if (!userId && !req.signedCookies.sessionId) {
        let session = new Session({
            cart: [],
        });
        await session.save();
        res.cookie("sessionId", session._id, { signed: true });
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
