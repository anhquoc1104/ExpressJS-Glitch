// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
//const sendMail = require("./config.sendGrid.js");

const app = express();

let db = require("./db");

let userRoute = require("./routes/users.route");
let bookRoute = require("./routes/books.route");
let transRoute = require("./routes/transactions.route");
let loginRoute = require("./routes/auth.route");
let requireAuth = require("./middlewares/auth.middleware");
let sessionMiddleware = require("./middlewares/session.middleware");
let cartRoute = require("./routes/carts.route");
let cartMiddleware = require("./middlewares/cartToAccount.middleware");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "2tryd6rt45eydhf756tyg"));
app.use(sessionMiddleware);

app.use("/users", requireAuth.authMiddlewares, userRoute);
app.use("/books", bookRoute);
app.use("/transactions", requireAuth.authMiddlewares, transRoute);
app.use("/carts", requireAuth.authMiddlewares, cartRoute);
app.use("/login", loginRoute);

//view engine
app.set("view engine", "pug");
app.set("views", "./views");
// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

//home
app.get("/", (req, res) => {
  //console.log(db.get("books").value());
  //console.log(req.signedCookies.sessionId);
  res.render("home.pug", {
    book: db.get("books").value(),
    userAdmin: db
      .get("users")
      .find({ id: req.signedCookies.userID })
      .value()
  });
});
app.get("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/login");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


//test sendGrid
// sendMail;

//set cookies
// let count = 0;
// function setCookies(req, res, next) {
//   if (!req.cookies.count) {
//     res.cookie("count", "cookie in here!");
//   }
//   next();
// }
// function getCookies(req, res, next) {
//   if (req.cookies.count) {
//     console.log(++count);
//     console.log(req.cookies.count);
//   }
//   next();
// }
