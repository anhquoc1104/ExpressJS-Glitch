let db = require('../db');

module.exports.addName = (req, res, next) => {
  let name = req.body.name;
  let err =[];
  if(name.length > 30){
    err.push('Name can\'t length great than 30 letter!!!')
    };
  if(name.length === 0){
     err.push('Name not null!!!')
     };
  if(err.length){
    res.render("./users/users.pug", {
      user: db.get("users").value(),
      err: err
    });
    return;
    };
  next();
}