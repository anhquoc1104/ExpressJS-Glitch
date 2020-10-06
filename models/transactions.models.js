const mongoose = require('../mongoose.js');

let transactionSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    bookId: mongoose.Schema.Types.ObjectId,
    createAt: Date,
    isComplete: String
}, {
    autoCreate: true
})

let Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction;