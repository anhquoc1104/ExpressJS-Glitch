// server.js
const express = require("express");
const app = express();

let db = require("./db");

let userRoute = require("./routes/users.route");
let bookRoute = require("./routes/books.route");
let transRoute = require('./routes/transactions.route');

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);
app.use("/books", bookRoute);
app.use('/transactions', transRoute);

//view engine
app.set("view engine", "pug");
app.set("views", "./views");
// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

//home
app.get("/", (req, res) => {
  res.render("home.pug", {
    book: db.get("books").value()
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
