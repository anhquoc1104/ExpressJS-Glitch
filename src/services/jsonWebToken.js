let jwt = require("jsonwebtoken");
require("dotenv").config();

const Constant = require("../services/constant");

module.exports = {
    token: jwt.sign(idUser, process.env.JWT_SECRET, {
        expiresIn: Constant.ONE_DAY_SECONDS,
    }),
    refreshToken: jwt.sign(isUser, process.env.JWT_REFRESH_SECRET, {
        expiresIn: Constant.ONE_DAY_SECONDS,
    }),
};
