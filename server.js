// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
//render HTML
const path = require('path');

//Variable
let todo=["đi chợ", "nấu cơm", "rửa chén", "học tại CodersX"];

//use body-parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//set view engine
app.set("view engine", "pug");
app.set("views", "./views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

// /todos route
app.get("/todos", (req, res) => {
  res.render("todos.pug",{
    todos: todo
  });
});

//param ?q= Search GET method
app.get("/todos/search", (req, res) => {
  let q = req.query.q;
  q = change_alias(q);
  let matchQuery = todo.filter((elm => {
    elm = change_alias(elm);
    return elm.indexOf(q) !== -1;
  }))
  res.render("todos.pug",{
    todos: matchQuery
  });
});

//Create todos list with POST method
app.post("/todos/create", (req, res) => {
  //console.log(req.body);
  todo.push(req.body.todo);
  res.redirect('/todos');
})

// index route
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});


//Change Vietnamese
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}
