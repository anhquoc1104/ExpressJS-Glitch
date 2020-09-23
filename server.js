// server.js
const express = require("express");
const reload = require('reload');
const pug = require('pug');
const cookieParser = require("cookie-parser");
require("dotenv").config();
//const sendMail = require("./config.sendGrid.js");
const app = express();
//const mongoose = require('./mongoose.js');
let Book = require('./models/books.models.js');
let User = require('./models/users.models.js');

let userRoute = require("./routes/users.route");
let bookRoute = require("./routes/books.route");
let transRoute = require("./routes/transactions.route");
let loginRoute = require("./routes/auth.route");
let requireAuth = require("./middlewares/auth.middleware");
let sessionMiddleware = require("./middlewares/session.middleware");
let cartRoute = require("./routes/carts.route");
let shopRoute = require("./routes/shops.route");

let port = process.env.PORT || 8080;

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
app.use("/shops", shopRoute);
app.use("/login", loginRoute);

//view engine
app.set("view engine", "pug");
app.set("views", "./views");

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

//home
app.get("/", async (req, res) => {
  let user = await User.findById(req.signedCookies.userID);
  let books = await Book.find();
  res.render("home.pug", {
    book: books,
    userAdmin: user
  });
});
  
app.get("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/");
});
// app.get("/clearSession", async (req, res) => {
//   let session = await
// })

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// reload(app);