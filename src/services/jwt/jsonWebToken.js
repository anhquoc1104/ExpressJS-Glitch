const jwt = require("jsonwebtoken");
require("dotenv").config();

const Constant = require("../constant");

module.exports = {
    tokenVerify: (idUser) => {
        return jwt.sign({ idUser }, process.env.JWT_SECRET, {
            expiresIn: Constant.ONE_DAY_SECONDS,
        });
    },
    refreshToken: (idUser) => {
        return jwt.sign({ idUser }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: Constant.ONE_DAY_SECONDS,
        });
    },
};
