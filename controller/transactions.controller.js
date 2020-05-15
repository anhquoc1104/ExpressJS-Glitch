const shortid = require("shortid");

let db = require('../db');
const change_alias = require('../changeAlias');

module.exports.home = (req, res) => {
  res.render('./transactions/transactions.pug', {
    trans: db.get('transactions').value()
  });
};

module.exports.create = (req, res) => {
  res.render('./transactions/create.pug', {
    book: db.get('books').value(),
    user: db.get('users').value()
  });
};

module.exports.createPost = (req, res) => {
  let userId = req.body.userId;
  let bookId = req.body.bookId;
  //console.log(userId);
  db.get('transactions')
    .push({
      id: shortid.generate(), 
      userID: userId, 
      bookID: bookId, 
      isComplete: false
    })
    .write();
  res.redirect('/transactions');
};

module.exports.isComplete = (req, res) => {
  let id = req.params.id;
  db.get('transactions')
    .find({id: id})
    .assign({isComplete: true})
    .write();
  //console.log(isTrans);
  res.redirect('/transactions');
};