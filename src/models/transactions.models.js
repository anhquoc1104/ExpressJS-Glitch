const mongoose = require("../services/mongoose.js");

let transactionSchema = mongoose.Schema(
    {
        idUser: mongoose.Schema.Types.ObjectId,
        idBook: mongoose.Schema.Types.ObjectId,
        createdAt: {
            type: Date,
            default: new Date(),
        },
        completedAt: Date,
        isComplete: {
            type: Boolean,
            default: false,
        },
        expired: {
            type: Boolean,
            default: false,
        },
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
