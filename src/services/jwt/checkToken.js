const jwt = require("jsonwebtoken");

module.exports = {
    verifyToken: (token, secretKey) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded);
            });
        });
    },
};
