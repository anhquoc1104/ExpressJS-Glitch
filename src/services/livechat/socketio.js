const dbStore = require("./dbStore.js");

let admins = {};
let usersOnline = {};

dbStore.ConnectToRedis();

function asRead(data) {
    return data.asRead ? (data.asRead = "false") : (data.asRead = "true");
}

module.exports = (io) => {
    io.on("connection", function (socket) {
        socket
            .on("disconnect", function () {
                if (socket.isAdmin) {
                    delete admins[socket.username];
                    for (let adminSocket in admins) {
                        adminSocket.emit("admin removed", socket.username);
                    }
                } else {
                    if (io.sockets.adapter.rooms[socket.roomID]) {
                        let total =
                            io.sockets.adapter.rooms[socket.roomID]["length"];
                        let totAdmins = Object.keys(admins).length;
                        let clients = total - totAdmins;
                        if (clients == 0) {
                            //check if user reconnects in 4 seconds
                            setTimeout(function () {
                                if (io.sockets.adapter.rooms[socket.roomID])
                                    total =
                                        io.sockets.adapter.rooms[socket.roomID][
                                            "length"
                                        ];
                                totAdmins = Object.keys(admins).length;
                                if (total <= totAdmins) {
                                    delete usersOnline[socket.roomID];
                                    socket.broadcast
                                        .to(socket.roomID)
                                        .emit(
                                            "User Disconnected",
                                            socket.roomID
                                        );
                                    for (let adminSocket in admins) {
                                        adminSocket.leave(socket.roomID);
                                    }
                                }
                            }, 4000);
                        }
                    } else {
                        if (socket.userDetails)
                            delete usersOnline[socket.roomID];
                    }
                }
            })
            .on("add admin", function (data) {
                this.isAdmin = data.isAdmin;
                socket.username = data.admin;
                admins[socket.username] = socket;
                dbStore
                    .getAllKey()
                    // .then((data) => { //del all db
                    //     for (let key of data) {
                    //         console.log(key);
                    //         dbStore.delKey(key);
                    //     }
                    // })
                    .then(async (dataRoomID) => {
                        if (dataRoomID) {
                            let arrRoomID = dataRoomID.filter((elm) => {
                                return elm.indexOf("details") === -1;
                            });
                            //Get user in db
                            if (arrRoomID && arrRoomID.length > 0) {
                                let userDetails = [];
                                for (let roomID of arrRoomID) {
                                    await dbStore
                                        .getDetails(roomID)
                                        .then(function (details) {
                                            userDetails.push({
                                                ...details,
                                                roomID,
                                            });
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                }
                                if (userDetails) {
                                    userDetails.sort((a, b) => {
                                        return +b[2] - +a[2];
                                    });
                                    for (let user of userDetails) {
                                        let { roomID } = user;
                                        dbStore
                                            .getMessages(roomID, 0, 0)
                                            .then(function (history) {
                                                let len = history.length;
                                                if (len > 1) {
                                                    history.splice(1, len); //get last message
                                                    socket.join(roomID); //admin join to client
                                                    socket.emit("client list", {
                                                        roomID,
                                                        msg: history,
                                                        userDetails: {
                                                            ...user,
                                                        },
                                                        justJoined: true,
                                                    });
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .on("add user", function (data) {
                socket.isAdmin = false;
                //Add new user
                if (data.isNewUser) {
                    data.timeStamp = new Date().getTime();
                    data.asRead = "true";
                    dbStore.setDetails(data);
                    socket.emit("roomID", data.roomID); //set roomID to localStorage
                }
                socket.roomID = data.roomID;
                //Fetch user details
                dbStore
                    .getDetails(socket.roomID)
                    .then(function (details) {
                        socket.userDetails = details;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                socket.join(socket.roomID);
                let newUser = false;
                if (!usersOnline[socket.roomID]) {
                    // Check if different instance of same user. (ie. Multiple tabs)
                    usersOnline[socket.roomID] = socket;
                    newUser = true;
                }
                //Fetch message history
                dbStore
                    .getMessages(socket.roomID, 0)
                    .then(function (history) {
                        history.splice(-1, 1);
                        socket.emit("chat history", {
                            history: history,
                            getMore: false,
                        });
                        if (Object.keys(admins).length == 0) {
                            //Tell user he will be contacted
                            socket.emit(
                                //admin off
                                "log message",
                                "Thank you for reaching us." +
                                    " Please leave your message here and we will get back to you shortly."
                            );
                        } else {
                            if (newUser) {
                                socket.emit(
                                    // admin onl
                                    "log message",
                                    "Hello " +
                                        socket.userDetails[0] +
                                        ", How can I help you?"
                                );
                                //Make all available admins join this usersOnline room.
                                for (let adminSocket in admins) {
                                    let admin = admins[adminSocket];
                                    admin.join(socket.roomID);
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                dbStore
                    .getMsgLength(socket.roomID)
                    .then(function (len) {
                        socket.MsgHistoryLen = len * -1 + 10;
                        socket.TotalMsgLen = len * -1;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            //admin click in users list
            .on("chat history", function (data) {
                let user;
                let { roomID } = data;
                dbStore
                    .getDetails(roomID)
                    .then(function (details) {
                        user = details;
                        if (user[3] === "false") {
                            //set asRead
                            dbStore.setDetails({
                                name: user[0],
                                email: user[1],
                                timeStamp: user[2],
                                asRead: "true",
                                roomID,
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                dbStore
                    .getMessages(roomID, 0)
                    .then(function (history) {
                        history.splice(-1, 1);
                        socket.emit("chat history", {
                            roomID,
                            history,
                            getMore: false,
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .on("chat message", function (data) {
                if (data.roomID === "null") data.roomID = socket.roomID;
                let { roomID, asRead } = data;
                let user;
                data.isAdmin = socket.isAdmin;

                dbStore
                    .getDetails(roomID)
                    .then(function (details) {
                        userDetails = details;
                        dbStore.setDetails({
                            name: userDetails[0],
                            email: userDetails[1],
                            timeStamp: data.timeStamp,
                            asRead,
                            roomID,
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                dbStore.pushMessage(data);

                //Un-send mess to userDetails off.
                if (data.isAdmin && !usersOnline[roomID]) {
                    return;
                }
                //send mess without Sender
                user = usersOnline[roomID].userDetails;
                user[2] = data.timeStamp;
                user[3] = asRead;
                socket.broadcast.to(roomID).emit("chat message", {
                    isAdmin: data.isAdmin,
                    roomID,
                    msg: [
                        {
                            who: data.isAdmin,
                            what: data.msg,
                            when: data.timeStamp,
                        },
                    ],
                    userDetails: {
                        ...user,
                    },
                });
            })
            .on("as read", function (data) {
                dbStore.setDetails({
                    name: data.userDetails[0],
                    email: data.userDetails[1],
                    timeStamp: data.userDetails[2],
                    asRead: "true",
                    roomID: data.roomID,
                });
            })
            .on("more messages", function () {
                if (socket.MsgHistoryLen < 0) {
                    dbStore
                        .getMessages(socket.roomID, socket.MsgHistoryLen)
                        .then(function (history) {
                            history.splice(-1, 1);
                            socket.emit("more chat history", {
                                history: history,
                            });
                        });
                    socket.MsgHistoryLen += 10;
                }
            })
            .on("typing", function (data) {
                socket.broadcast.to(data.roomID).emit("typing", {
                    isTyping: data.isTyping,
                    person: data.person,
                    roomID: data.roomID,
                });
            });
    });
};
