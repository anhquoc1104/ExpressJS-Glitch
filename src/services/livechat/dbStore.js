let redis = require("redis");
let redisClient;
const threeDay = 3600 * 24 * 3;

exports.ConnectToRedis = function () {
    // redisClient = redis.createClient(config.redis_port, config.redis_hostname);
    redisClient = redis.createClient(process.env.REDISCLOUD_URL, {
        no_ready_check: true,
    });
    redisClient.on("connect", function () {
        console.log("Connected to Redis");
    });

    redisClient.on("error", function () {
        console.log("Failed to connect to Redis");
    });
};

exports.getMessages = function (roomID, startPos, endPos) {
    if (!endPos) {
        if (startPos > -10 && startPos < 0) endPos = -1;
        else endPos = startPos + 9;
    }
    return new Promise((resolve, reject) => {
        redisClient.lrange(roomID, startPos, endPos, function (err, res) {
            if (!err) {
                let result = [];
                // Loop through the list, parsing each item into an object
                for (let msg in res) result.push(JSON.parse(res[msg]));
                result.push(roomID);
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};

exports.pushMessage = function (data) {
    redisClient.lpush(
        data.roomID,
        JSON.stringify({
            who: data.isAdmin,
            what: data.msg,
            when: data.timestamp,
        })
    );
    redisClient.expire(data.roomID + "-details", threeDay);
    redisClient.expire(data.roomID, threeDay);
};

exports.setDetails = function (data) {
    let { name, email, timeStamp, asRead, roomID } = data;
    redisClient.hmset(roomID + "-details", {
        name,
        email,
        timeStamp,
        asRead,
    });
};

exports.setExpire = function (data) {
    // Set all key in data
    // if (data) {
    //     for (let roomID of data) {
    //         redisClient.expire(roomID, fiveDay);
    //     }
    // }
    redisClient.expire(data.roomID + "-details", fiveDay);
    redisClient.expire(data.roomID, fiveDay);
};

exports.getDetails = function (roomID) {
    return new Promise((resolve, reject) => {
        redisClient.hmget(
            roomID + "-details",
            ["name", "email", "timeStamp", "asRead"],
            function (err, result) {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        );
    });
};

exports.getAllKey = function () {
    return new Promise((resolve, reject) => {
        redisClient.keys("*", function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};

exports.delKey = function (key) {
    redisClient.del(key);
};

exports.getMsgLength = function (roomID) {
    return new Promise((resolve, reject) => {
        redisClient.llen(roomID, function (err, len) {
            if (err) {
                console.log(err);
            }
        });
    });
};
