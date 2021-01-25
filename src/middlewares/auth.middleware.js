let User = require("../models/users.models.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let token = require("../services/jwt/jsonWebToken");
let checkToken = require("../services/jwt/checkToken");

module.exports.authMiddlewares = async (req, res, next) => {
    let cookieUser = req.signedCookies.userId;
    if (!cookieUser) {
        res.redirect("/login");
        return;
    }
    let id = await User.findById(cookieUser);
    if (!id) {
        res.redirect("/login");
        return;
    }
    next();
};

module.exports.verifyAccountMiddlewares = async (req, res, next) => {
    let token = req.params.jwtIdUser;
    if (token) {
        try {
            await checkToken.verifyToken(token, process.env.JWT_SECRET);
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                let decoded = jwt.verify(token, process.env.JWT_SECRET, {
                    ignoreExpiration: true,
                });
                //check user Verified
                let user = await User.find({
                    _id: decoded.idUser,
                    status: "pending",
                });
                if (user) {
                    res.render("./statusCode/statusResendEmail.pug", {
                        pathRoute: "register",
                        idUser: user[0]._id,
                        email: user[0].email,
                    });
                    return;
                }
            }
            res.render("./statusCode/status404.pug");
            return;
        }
    } else {
        res.render("./statusCode/status404.pug");
    }
};
