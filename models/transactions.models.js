const mongoose = require('../mongoose.js');

let transactionSchema = mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId,
  bookID: mongoose.Schema.Types.ObjectId,
  isComplete: String
},{
  autoCreate: true
})

let Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction;