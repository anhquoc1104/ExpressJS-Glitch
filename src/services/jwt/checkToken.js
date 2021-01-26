const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded);
            });
        });
    },
};
