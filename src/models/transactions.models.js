const mongoose = require("../services/mongoose.js");

let transactionSchema = mongoose.Schema(
  {
    idUser: mongoose.Schema.Types.ObjectId,
    idBook: mongoose.Schema.Types.ObjectId,
    createAt: {
      type: Date,
      default: new Date(),
    },
    isComplete: String,
  },
  {
    autoCreate: true,
  }
);

let Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);

module.exports = Transaction;
