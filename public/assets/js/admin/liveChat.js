// Initialize variables
let $window = $(window);

let $newChat = $("#chatSound")[0];
let $usersBody = $(".users__body");
let $msgHistory = $(".msg__history"); // Messages area
let $newMsg = $(".msg__push--new"); //Dummy to push new msgs
let $oldMsg = $(".msg__push--old"); //Dummy to push msg history
let $inputMessage; // Input message input box

let $usernameDiv;
// let username; //Store admin username
let authenticated = false; //Boolean to check if admin is authenticated
// let connected = false;
let typing = false; //Boolean to check if admin is typing
let timeout = undefined; //Timeout to monitor typing

let socket = io(); //io socket
//$newUser.loop = true;
Notification.requestPermission();

function formatDate(date) {
    return {
        getMonthFormat: (date.getMonth() + 1).toString().padStart(2, "0"),
        getDateFormat: date.getDate().toString().padStart(2, "0"),
        getHoursFormat: date.getHours().toString().padStart(2, "0"),
        getMinutesFormat: date.getMinutes().toString().padStart(2, "0"),
    };
}

function addAdminToSocket() {
    if (userAdmin) {
        socket.emit("add admin", {
            admin: userAdmin.name,
            isAdmin: true,
        });
    }
}

function notifyAdmin(title, body) {
    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
        let notification = new Notification(title, {
            icon: "",
            body: body,
        });
        notification.onclick = function () {
            $window.focus();
            this.cancel();
        };
    }
}

function sendMessage(roomID) {
    let msg = $inputMessage.val().trim();
    // Prevent markup from being injected into the message
    msg = cleanInput(msg);

    if (msg) {
        $inputMessage.val("");
        // tell server to execute 'new message' and send along one parameter
        let timeStamp = new Date().getTime();
        socket.emit("chat message", {
            roomID,
            msg,
            timeStamp,
            asRead: "true",
        });

        let data = {
            roomID,
            msg: [
                {
                    who: true,
                    what: msg,
                    when: timeStamp,
                },
            ],
        };
        //send msg to Client
        $msgHistory.prepend(showMessReceive(data));
        //Render in panel users
        let $user = $(".users__body #" + data.roomID);
        let $userContent = $user;
        if ($user) {
            $user.remove();
        }
        if ($userContent) {
            $userContent.find(" .msg__user--content").text(msg);
        }
        $usersBody.prepend($userContent);
        //$msgHistory[0].scrollTop = $msgHistory[0].scrollHeight;
    }
}

function isTyping(roomID) {
    if (event.which !== 13 && event.which !== undefined) {
        if (typing === false && $inputMessage.is(":focus")) {
            typing = true;
            socket.emit("typing", {
                isTyping: true,
                roomID,
                person: "Admin",
            });
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeoutFunction(roomID);
            }, 2000);
        }
    } else {
        sendMessage(roomID);
        clearTimeout(timeout);
        timeoutFunction(roomID);
    }
}

function timeoutFunction(roomID) {
    typing = false;
    socket.emit("typing", {
        isTyping: false,
        roomID,
        person: "Admin",
    });
}

function getChatArea(data) {
    let date = new Date(data.msg[0].when);
    let asRead = "";
    if (data.userDetails[3] === "false") {
        asRead = `<span class="dot"><i class="bg-danger"></i></span>`;
    }
    return `
    <div class="m-0 msg__list" id="${data.roomID}">
          <div class="msg__user d-flex">
              <div class="msg__user--img"><img src="/sources/img/user-chat-default.png" alt="userAdmin" /></div>
              <div class="msg__user--ib">
                  <h5 class="msg__user--name d-flex justify-content-between"><span>${
                      data.userDetails[0]
                  }</span><small class="msg__user--date">${
        formatDate(date).getDateFormat
    }/${formatDate(date).getMonthFormat}</small></h5>
                  <p class="msg__user--content m-auto">${
                      data.msg[0].what
                  }${asRead}</p>
              </div>
          </div>
  </div>
  `;
}

function getChatHistory(data, getMore) {
    let date = new Date(data["when"]);
    let $messageBodyDiv;
    if (!data["who"])
        //client
        $messageBodyDiv = $(`
        <div class="msg__incoming">
            <div class="msg__incoming--img">
                <img src="/sources/img/user-chat-default.png" alt="userAdmin" />
            </div>
            <div class="msg__incoming--received">
                <p>${data["what"]}</p>
                <span class="msg__history--date">${
                    formatDate(date).getHoursFormat
                }:${formatDate(date).getMinutesFormat} | ${
            formatDate(date).getDateFormat
        }/${formatDate(date).getMonthFormat}</span>
            </div>
        </div>`);
    //admin
    else
        $messageBodyDiv = $(`
    <div class="msg__outgoing">
        <div class="msg__outgoing--send">
            <p class="m-0">${data["what"]}</p>
            <span class="msg__history--date">${
                formatDate(date).getHoursFormat
            }:${formatDate(date).getMinutesFormat} | ${
            formatDate(date).getDateFormat
        }/${formatDate(date).getMonthFormat}</span>
        </div>
    </div>`);
    if (getMore) {
        $messageBodyDiv.insertBefore($newMsg);
        $msgHistory[0].scrollTop += $messageBodyDiv.outerHeight();
    } else {
        $messageBodyDiv.insertAfter($oldMsg);
        $msgHistory[0].scrollTop = $msgHistory[0].scrollHeight;
    }
}

function showMessReceive(data) {
    let date = new Date(data.msg[0].when);
    if (data.msg[0].who) {
        return $(`
        <div class="msg__outgoing">
            <div class="msg__outgoing--send">
                <p class="m-0">${data.msg[0].what}</p>
                <span class="msg__history--date">${
                    formatDate(date).getHoursFormat
                }:${formatDate(date).getMinutesFormat} | ${
            formatDate(date).getDateFormat
        }/${formatDate(date).getMonthFormat}
                </span>
            </div>
    </div>`);
    }
    return $(`
    <div class="msg__incoming">
        <div class="msg__incoming--img">
            <img src="/sources/img/user-chat-default.png" alt="userAdmin" />
        </div>
        <div class="msg__incoming--received">
            <p>${data.msg[0].what}</p>
            <span class="msg__history--date">${
                formatDate(date).getHoursFormat
            }:${formatDate(date).getMinutesFormat} | ${
        formatDate(date).getDateFormat
    }/${formatDate(date).getMonthFormat}</span>
        </div>
    </div>`);
}

// Prevents input from having injected markup
function cleanInput(msg) {
    return $("<div/>").text(msg).text();
}

$(document).ready(function () {
    addAdminToSocket();
});

//get chat of user
$(document).on("click", ".msg__list", function (e) {
    e.preventDefault();
    //remove active class.
    if ($(".msg__active")) {
        $(".msg__active").removeClass("msg__active");
    }
    if ($(this).find(".dot")) {
        $(this).find(".dot").remove();
    }
    let roomID = $(this).attr("id");
    if (roomID) {
        $(this).addClass("msg__active");
        socket.emit("chat history", { roomID });
    }
});

$msgHistory.on("scroll", function () {
    if ($msgHistory.scrollTop() == 0) socket.emit("more messages", {});
});

socket
    .on("client list", function (data) {
        $usersBody.append(getChatArea(data));
    })
    .on("chat message", function (data) {
        let $user = $(".users__body #" + data.roomID);
        if ($user) {
            if ($user.hasClass("msg__active")) {
                data.userDetails[3] = "true";
                socket.emit("as read", data); //set asRead
                $msgHistory.prepend(showMessReceive(data));
            }
            $user.remove();
        }
        $usersBody.prepend(getChatArea(data));
        $newChat.play();
    })
    .on("chat history", function (data) {
        let { roomID, history, getMore } = data;
        if ($(".msg__incoming")) {
            $(".msg__incoming").remove();
        }
        if ($(".msg__outgoing")) {
            $(".msg__outgoing").remove();
        }
        if ($(".msg__type")) {
            $(".msg__type").remove();
        }
        let len = history.length;
        for (let i = len - 1; i >= 0; i--) {
            getChatHistory(history[i], getMore);
        }
        let $inputMsg = $(`
        <div class="typing"></div>
        <div class="msg__type">
            <div class="type__wrap">
                <input class="inputMessage w-100" type="text" placeholder="Type a message" autofocus/>
                <button class="btn type--send p-0" type="button">
                    <i class="fa fa-paper-plane"></i>
                </button>
            </div>
        </div>`).insertAfter($msgHistory);

        $inputMessage = $(".inputMessage");
        $inputMessage.on("keypress", function () {
            isTyping(roomID);
        });
    })
    .on("typing", function (data) {
        let $user = $(".users__body #" + data.roomID);
        if ($user) {
            if ($user.hasClass("msg__active")) {
                let $typing = $(".typing");
                if (data.isTyping) {
                    $typing.append(
                        "<small>" + data.person + " is typing...<small>"
                    );
                } else $typing.text("");
            }
        }
    })
    // .on("User Disconnected", function (roomID) {
    //     // $newUser.pause();
    //     $inputMessage = $("#" + roomID);
    //     $inputMessage.off();
    //     let $parent = $inputMessage.parent();
    //     $parent.remove();
    // })
    // .on("reconnect", function () {
    //     console.log("Reconnected!");
    //     $userList.empty();
    //     $(".container").empty();
    //     $errorPage.fadeOut();
    //     $userList.append("<li id=" + username + ">" + username + "</li>");
    //     if (authenticated)
    //         socket.emit("add admin", {
    //             admin: username,
    //             isAdmin: true,
    //         });
    // })
    // .on("reconnect_failed", function () {
    //     console.log("Reconnection Failed!");
    //     let $errorMsg = $errorPage.children(".title");
    //     $errorMsg.text("Reconection Failed. Please refresh your page. ");
    //     $window.alert("Disconnected from chat.");
    // });
    .on("disconnect", function () {
        console.log("Disconnected!");
    });
