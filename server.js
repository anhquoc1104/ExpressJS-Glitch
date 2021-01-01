const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const socketio = require("./src/services/livechat/socketio");
let pagination = require("./src/services/pagination");

// Model
let Book = require("./src/models/books.models.js");
let User = require("./src/models/users.models.js");

// Route
let userRoute = require("./src/routes/users.route");
let bookRoute = require("./src/routes/books.route");
let transRoute = require("./src/routes/transactions.route");
let loginRoute = require("./src/routes/auth.route");
let cartRoute = require("./src/routes/carts.route");
let requireAuth = require("./src/middlewares/auth.middleware");
let sessionMiddleware = require("./src/middlewares/session.middleware");
let isAdminMiddleware = require("./src/middlewares/isAdmin.middleware");

// Route - Admin
let userRouteAdmin = require("./src/routes/admin/users.route");
let bookRouteAdmin = require("./src/routes/admin/books.route");
let transRouteAdmin = require("./src/routes/admin/transactions.route");
let cartRouteAdmin = require("./src/routes/admin/carts.route");
let messagesRouteAdmin = require("./src/routes/admin/messages.route");
let dashboardAdmin = require("./src/controller/admin/dashboard.controller");

let port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("public"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "2tryd6rt45eydhf756tyg"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(async (req, res, next) => {
    let userId = req.signedCookies.userId;
    let user = (userId && (await User.findById(userId))) || undefined;
    if (user) {
        res.locals.isUserLogin = user;
    } else {
        res.locals.isUserLogin = "";
    }
    // console.log(res.locals.isUserLogin);
    next();
});
app.use(sessionMiddleware);
app.use("/users", requireAuth.authMiddlewares, userRoute);
app.use("/books", bookRoute);
app.use("/transactions", requireAuth.authMiddlewares, transRoute);
app.use("/carts", requireAuth.authMiddlewares, cartRoute);
app.use("/login", loginRoute);

// admin
app.use("/admin", isAdminMiddleware);
app.use("/admin/books", bookRouteAdmin);
app.use("/admin/users", userRouteAdmin);
app.use("/admin/transactions", transRouteAdmin);
app.use("/admin/carts", cartRouteAdmin);
app.use("/admin/messages", messagesRouteAdmin);
app.get("/admin", dashboardAdmin);

//view engine
app.set("view engine", "pug");
app.set("views", "./views");

//home
let homePage = async (req, res) => {
    let page = 1;
    let { userId } = req.signedCookies;

    let onSort = (sort) => {
        switch (sort) {
            case "DateUp":
                return { createAt: 1 };
            case "DateDown":
                return { createAt: -1 };
            case "NameUp":
                return { title: 1 };
            case "NameDown":
                return { title: -1 };
            default:
                return { createAt: 1 };
        }
    };
    let { sort } = req.body || "DateUp";
    let isSort = onSort(sort);

    //...
    let user = userId && (await User.findById(userId));
    let books = await Book.find().sort(isSort);
    let obj = pagination(user, page, 12, "books", books, "/page/");
    res.render("home.pug", obj);
};
app.get("/", homePage);
app.post("/", homePage);

app.get("/page/:number", async (req, res) => {
    let page = req.params.number;
    let { userId } = req.signedCookies;
    let user = userId && (await User.findById(userId));
    if (page <= 1) {
        res.redirect("/");
        return;
    }
    let books = await Book.find();
    let obj = pagination(user, page, 12, "books", books, "/page/");
    res.render("home.pug", obj);
});

app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.redirect("/");
});

//using liveChat
socketio(io);

// listen for requests :)
const listener = server.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
