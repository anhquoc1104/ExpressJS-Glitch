const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
//const sendMail = require("./config.sendGrid.js");
const app = express();
let pagination = require("./pagination");

// Model
let Book = require("./models/books.models.js");
let User = require("./models/users.models.js");

// Route
let userRoute = require("./routes/users.route");
let bookRoute = require("./routes/books.route");
let transRoute = require("./routes/transactions.route");
let loginRoute = require("./routes/auth.route");
let cartRoute = require("./routes/carts.route");
let requireAuth = require("./middlewares/auth.middleware");
let sessionMiddleware = require("./middlewares/session.middleware");
// Route Admin
let userRouteAdmin = require("./routes/admin/users.route");
let bookRouteAdmin = require("./routes/admin/books.route");
let transRouteAdmin = require("./routes/admin/transactions.route");
let cartRouteAdmin = require("./routes/admin/carts.route");
let dashboardAdmin = require("./controller/admin/dashboard.controller");

let port = process.env.PORT || 8080;

app.use(express.static("public"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "2tryd6rt45eydhf756tyg"));

app.use(async (req, res, next) => {
  let userId = req.signedCookies.userId;
  let user = userId && (await User.findById(userId));
  res.locals.isUserLogin = user;
  // console.log(user.isAdmin);
  next();
});
app.use(sessionMiddleware);
app.use("/users", requireAuth.authMiddlewares, userRoute);
app.use("/books", bookRoute);
app.use("/transactions", requireAuth.authMiddlewares, transRoute);
app.use("/carts", requireAuth.authMiddlewares, cartRoute);
app.use("/login", loginRoute);

// admin
app.use("/admin/books", bookRouteAdmin);
app.use("/admin/users", requireAuth.authMiddlewares, userRouteAdmin);
app.use("/admin/transactions", requireAuth.authMiddlewares, transRouteAdmin);
app.use("/admin/carts", requireAuth.authMiddlewares, cartRouteAdmin);
app.get("/admin", requireAuth.authMiddlewares, dashboardAdmin);

//view engine
app.set("view engine", "pug");
app.set("views", "./views");

//home
app.get("/", async (req, res) => {
  let page = 1;
  let { userId } = req.signedCookies;
  let user = userId && (await User.findById(userId));
  let books = await Book.find();
  let obj = pagination(user, page, 12, "books", books, "/page/");
  res.render("home.pug", obj);
});

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

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// reload(app);
