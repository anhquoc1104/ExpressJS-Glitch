var redis = require("redis");
var config = require("./config.liveChat");
//var Q = require("q");
var redisClient;

exports.ConnectToRedis = function(startApp) {
    // redisClient = redis.createClient(config.redis_port, config.redis_hostname);
    redisClient = redis.createClient(config.redis_port, config.redis_hostname);
    //   console.log(redis);
    redisClient.on("connect", function() {
        console.log("Connected to Redis");
        //startApp(true);
    });

    redisClient.on("error", function() {
        console.log("Failed to connect to Redis");
        //startApp(false);
    });
};

exports.getMessages = async function(roomID, startPos, endPos) {
    if (endPos == undefined) {
        if (startPos > -10 && startPos < 0) endPos = -1;
        else endPos = startPos + 9;
    }

    return new Promise((resolve, reject) => {
        redisClient.lrange(roomID, startPos, endPos, function(err, res) {
            if (!err) {
                var result = [];
                // Loop through the list, parsing each item into an object
                for (var msg in res) result.push(JSON.parse(res[msg]));
                result.push(roomID);
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};

exports.pushMessage = function(data) {
    redisClient.lpush(
        data.roomID,
        JSON.stringify({
            who: data.isAdmin,
            what: data.msg,
            when: data.timestamp,
        })
    );
};

exports.setDetails = function(data) {
    redisClient.hmset(data.roomID + "-details", {
        Name: data.Name,
        Email: data.Email,
    });
};

exports.getDetails = async function(roomID) {
    return new Promise((resolve, reject) => {
        redisClient.hmget(
            roomID + "-details", ["Name", "Email"],
            function(err, result) {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        );
    });
};

exports.getMsgLength = async function(roomID) {
    return new Promise((resolve, reject) => {
        redisClient.llen(roomID, function(err, len) {
            if (!err) {
                resolve(len);
            } else {
                reject(err);
            }
        });
    });
};