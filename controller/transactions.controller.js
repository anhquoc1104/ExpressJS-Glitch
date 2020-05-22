const shortid = require("shortid");

let db = require('../db');
const change_alias = require('../changeAlias');

module.exports.home = (req, res) => {
  let user = db.get('users').find({id: req.signedCookies.userID}).value();
  let page = req.params.page || 1;
  let page5Num = [parseInt(page) - 2, parseInt(page) - 1, page, parseInt(page) + 1, parseInt(page) + 2];
  //console.log(page);
  let perPage = 5;
  let startIx = (page - 1) * perPage;
  let endIx = page * perPage;
  
  if(user.isAdmin){
    let totalPage = Math.ceil((db.get('transactions').value().length)/perPage);
    //console.log(elm);
    res.render('./transactions/transactions.pug', {
      //trans: db.get('transactions').value(),
      //user: user,
      item: db.get('transactions').drop(startIx).take(perPage).value(),
      startPage: page,
      page: page,
      endPage: totalPage,
      pagePre: page5Num[1],
      pageNext: page5Num[3],
      page5Num: page5Num
    });
    return;
  }
  let totalPage = Math.ceil((db.get('transactions').filter({userID: user.id}).value().length)/perPage);
  //console.log(elm);
  res.render('./transactions/transactions.pug', {
    //trans: db.get('transactions').value(),
    item: db.get('transactions')
            .filter({userID: user.id})
            .drop(startIx).take(perPage)
            .value(),
    startPage: page,
    page: page,
    endPage: totalPage,
    pagePre: page5Num[1],
    pageNext: page5Num[3],
    page5Num: page5Num
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
  let isTrue = db.get('transactions')
    .find({id: id});
  if(isTrue.value()){
    isTrue.assign({isComplete: true})
    .write();
  }
  res.redirect('/transactions');
};