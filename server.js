const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
let cron = require("node-cron");

require("dotenv").config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const socketio = require("./src/services/livechat/socketio");
let pagination = require("./src/services/pagination");
let onSort = require("./src/services/sort");
let crontab = require("./src/services/crontab/crontab");

let port = process.env.PORT || 8080;

// Model
let Book = require("./src/models/books.models.js");
let User = require("./src/models/users.models.js");

app.use(express.static("public"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "2tryd6rt45eydhf756tyg"));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "somesecret",
        cookie: { maxAge: 60000 },
    })
);
app.use(flash());

//view engine
app.set("view engine", "pug");
app.set("views", "./views");

// Route - Admin
let userRouteAdmin = require("./src/routes/admin/users.route");
let bookRouteAdmin = require("./src/routes/admin/books.route");
let transRouteAdmin = require("./src/routes/admin/transactions.route");
let cartRouteAdmin = require("./src/routes/admin/carts.route");
let searchRouteAdmin = require("./src/routes/admin/searchs.route");
let messagesRouteAdmin = require("./src/routes/admin/messages.route");
let dashboardAdmin = require("./src/controller/admin/dashboard.controller");

// Route
let userRoute = require("./src/routes/users.route");
let bookRoute = require("./src/routes/books.route");
let transRoute = require("./src/routes/transactions.route");
let loginRoute = require("./src/routes/login.route");
let authRoute = require("./src/routes/auth.route");
let cartRoute = require("./src/routes/carts.route");
let hictoryRoute = require("./src/routes/hictories.route");
let requireAuth = require("./src/middlewares/auth.middleware");
let sessionMiddleware = require("./src/middlewares/session.middleware");
let isAdminMiddleware = require("./src/middlewares/isAdmin.middleware");

app.use(async (req, res, next) => {
    let { userId } = req.signedCookies;
    let user = (userId && (await User.findById(userId))) || undefined;
    if (user) {
        res.locals.isUserLogin = user;
    } else {
        res.locals.isUserLogin = "";
    }
    next();
});

app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.redirect("/");
});

// admin
app.use("/admin", isAdminMiddleware);
app.use("/admin/books", bookRouteAdmin);
app.use("/admin/users", userRouteAdmin);
app.use("/admin/transactions", transRouteAdmin);
app.use("/admin/carts", cartRouteAdmin);
app.use("/admin/search", searchRouteAdmin);
app.use("/admin/messages", messagesRouteAdmin);
app.get("/admin", dashboardAdmin);

app.use(sessionMiddleware);
app.use("/users", requireAuth.authMiddlewares, userRoute);
app.use("/books", bookRoute);
app.use("/transactions", requireAuth.authMiddlewares, transRoute);
app.use("/carts", requireAuth.authMiddlewares, cartRoute);
app.use("/hictories", requireAuth.authMiddlewares, hictoryRoute);
app.use("/login", loginRoute);
app.use("/auth", authRoute);

//home
let homePage = async (req, res) => {
    let page = 1;
    let { sort } = req.body || "DateUp";
    let isSort = onSort(sort);

    //...
    let books = await Book.find().sort(isSort);
    let obj = pagination(page, 12, "books", books, "/page/");
    res.render("home.pug", { ...obj, mess: req.flash("messages") });
};
app.get("/", homePage);
app.post("/", homePage);

app.get("/page/:number", async (req, res) => {
    let page = req.params.number;
    if (page <= 1) {
        res.redirect("/");
        return;
    }
    let books = await Book.find();
    let obj = pagination(page, 12, "books", books, "/page/");
    res.render("home.pug", obj);
});

app.use((req, res, next) => {
    setTimeout(() => {
        res.render("./statusCode/status404.pug");
        next();
    }, 2000);
});

//using liveChat
socketio(io);

//Crontab
cron.schedule("0 0 * * *", () => {
    console.log("running a task every day");
    crontab.checkCartExpired();
    crontab.checkTransactionExpired();
    // crontab.checkUserUnlock();
});

// listen for requests :)
const listener = server.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
