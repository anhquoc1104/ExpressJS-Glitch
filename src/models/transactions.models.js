const mongoose = require("../services/mongoose.js");

let transactionSchema = mongoose.Schema(
    {
        idUser: mongoose.Schema.Types.ObjectId,
        idBook: mongoose.Schema.Types.ObjectId,
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
    }
);

let Transaction = mongoose.model(
    "Transaction",
    transactionSchema,
    "transactions"
);

module.exports = Transaction;
