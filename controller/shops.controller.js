let Transaction = require('../models/transactions.models.js');
let User = require('../models/users.models.js');
let Book = require('../models/books.models.js');

module.exports.home = (req, res) => {
  res.render('./shops/shop.pug');
}