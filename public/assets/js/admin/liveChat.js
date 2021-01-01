// Initialize variables
let $window = $(window);
//let $newUser = $("#windowSound")[0];
let $newChat = $("#chatSound")[0];
let $userList = $(".msg__list"); // List of online users
let $inputMessage; // Input message input box
let $usersBody = $(".users__body");
let $messages = $(".msg__history"); // Messages area
let $newMsg = $(".msg__push--new"); //Dummy to push new msgs
let $oldMsg = $(".msg__push--old"); //Dummy to push msg history

let $usernameDiv;
let username; //Store admin username
let authenticated = false; //Boolean to check if admin is authenticated
let connected = false;
let typing = false; //Boolean to check if admin is typing
let timeout = undefined; //Timeout to monitor typing

let socket = io(); //io socket
//$newUser.loop = true;
Notification.requestPermission();

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

function sendMessage(id) {
    $inputMessage = $("#" + id);
    let $parent = $inputMessage.parent();
    let $messages = $parent.children(".messages");
    let message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
        $inputMessage.val("");
        // tell server to execute 'new message' and send along one parameter
        let time = "" + new Date();
        socket.emit("chat message", {
            roomID: id,
            msg: message,
            timestamp: time,
        });
        $usernameDiv = $('<span class="username"/>').text("Admin");
        let $messageBodyDiv = $('<span class="messageBody">').text(message);
        let $timestampDiv = $('<span class="timestamp">').text(
            time.toLocaleString().substr(15, 6)
        );
        $messageDiv = $('<li class="message"/>').append(
            $usernameDiv,
            $messageBodyDiv,
            $timestampDiv
        );
        $messages.append($messageDiv);
        //$messages[0].scrollTop = $messages[0].scrollHeight;
    }
}

function isTyping() {
    let id = event.target.id;
    if (event.which !== 13 && event.which !== undefined) {
        if (typing === false && $("#" + id).is(":focus")) {
            typing = true;
            socket.emit("typing", {
                isTyping: true,
                roomID: id,
                person: username,
            });
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeoutFunction(id);
            }, 2000);
        }
    } else {
        sendMessage(id);
        clearTimeout(timeout);
        timeoutFunction(id);
    }
}

function timeoutFunction(id) {
    typing = false;
    socket.emit("typing", {
        isTyping: false,
        roomID: id,
        person: username,
    });
}

function getChatArea(data) {
    return `
    <div class="m-0 msg__list msg__active" id="${data.roomID}">
          <div class="msg__user d-flex">
              <div class="msg__user--img"><img src="/sources/img/user-chat-default.png" alt="userAdmin" /></div>
              <div class="msg__user--ib">
                  <h5 class="msg__user--name d-flex justify-content-between"><span>${
                      data.userDetails[0]
                  }</span><small class="msg__user--date">${new Date(
        data.history[0].when
    ).getDate()}/${new Date(data.history[0].when).getMonth()}</small></h5>
                  <p class="msg__user--content m-auto">${
                      data.history[0].what
                  }</p>
              </div>
          </div>
  </div>
  `;
}
function getChatHistory(data, getMore) {
    let $messageBodyDiv;
    if (!data["who"])
        //client
        $messageBodyDiv = $(`
        <div class="msg__incoming">
            <div class="msg__incoming--img">
                <img src="/sources/img/user-chat-default.png" alt="userAdmin" />
            </div>
            <div class="msg__incoming--received">
                <p>${data["what"]}s</p>
                <span class="msg__history--date">${data["when"]
                    .toLocaleString()
                    .substr(15, 6)}</span>
            </div>
        </div>`);
    //admin
    else
        $messageBodyDiv = $(`
    <div class="msg__outgoing">
        <div class="msg__outgoing--send">
            <p class="m-0">${data["what"]}</p>
            <span class="msg__history--date">${data["when"]
                .toLocaleString()
                .substr(15, 6)}</span>
        </div>
    </div>`);
    if (getMore) {
        $messageBodyDiv.insertAfter($oldMsg);
        $messages[0].scrollTop += $messageBodyDiv.outerHeight();
    } else {
        $messageBodyDiv.insertBefore($newMsg);
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }
}

// Prevents input from having injected markup
function cleanInput(input) {
    return $("<div/>").text(input).text();
}

$(document).ready(function () {
    addAdminToSocket();
});

$usersBody.click(function (e) {
    e.preventDefault();
    let user = $(this).children(".msg__list");
    let roomID = user.attr("id");
    user.addClass("msg__active");
    socket.emit("chat history", { roomID });
});

$messages.on("scroll", function () {
    if ($messages.scrollTop() == 0) socket.emit("more messages", {});
});

socket;
jq.on("client list", function (data) {
    $usersBody.append(getChatArea(data));
})
    .on("chat message", function (data) {
        $inputMessage = $("#" + data.roomID);
        let $parent = $inputMessage.parent();
        let $messages = $parent.children(".messages");
        if (data.isAdmin)
            $usernameDiv = $('<span class="username"/>').text("CronJ");
        else $usernameDiv = $('<span class="username"/>').text("Client");

        let $messageBodyDiv = $('<span class="messageBody">').text(data.msg);
        let $timestampDiv = $('<span class="timestamp">').text(
            data.timestamp.toLocaleString().substr(15, 6)
        );
        let $messageDiv = $('<li class="message"/>').append(
            $usernameDiv,
            $messageBodyDiv,
            $timestampDiv
        );
        $messages.append($messageDiv);
        //$messages[0].scrollTop = $messages[0].scrollHeight;
        //$newChat.play();
    })
    .on("chat history", function (data) {
        let len = data.history.length;
        for (let i = len - 1; i >= 0; i--) {
            getChatHistory(data.history[i], false);
        }
        let $inputMsg = $(`
        <div class="msg__type">
            <div class="type__wrap">
                <input class="w-100" type="text" placeholder="Type a message" />
                <button class="btn type--send p-0" type="button">
                    <i class="fa fa-paper-plane"></i>
                </button>
            </div>
        </div>`).insertAfter($messages);
    })
    .on("typing", function (data) {
        $inputMessage = $("#" + data.roomID);
        let $parent = $inputMessage.parent();
        let $typing = $parent.children(".typing");
        if (data.isTyping)
            $typing.append("<small>" + data.person + " is typing...<small>");
        else $typing.text("");
    })
    .on("User Disconnected", function (roomID) {
        // $newUser.pause();
        $inputMessage = $("#" + roomID);
        $inputMessage.off();
        let $parent = $inputMessage.parent();
        $parent.remove();
    })
    .on("reconnect", function () {
        console.log("Reconnected!");
        $userList.empty();
        $(".container").empty();
        $errorPage.fadeOut();
        $userList.append("<li id=" + username + ">" + username + "</li>");
        if (authenticated)
            socket.emit("add admin", {
                admin: username,
                isAdmin: true,
            });
    })
    .on("disconnect", function () {
        console.log("Disconnected!");
        $errorPage.show();
    })
    .on("reconnect_failed", function () {
        console.log("Reconnection Failed!");
        let $errorMsg = $errorPage.children(".title");
        $errorMsg.text("Reconection Failed. Please refresh your page. ");
        $window.alert("Disconnected from chat.");
    });
