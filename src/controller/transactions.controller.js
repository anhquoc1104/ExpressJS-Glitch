let Transaction = require("../models/transactions.models.js");
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");

let formatDate = require("../services/formatDate");

const fourteenDay = 1000 * 60 * 60 * 24 * 14;

module.exports = {
    home: async (req, res) => {
        let user = await User.findById(req.signedCookies.userId);
        let arrTransaction = [];
        let { idTransaction } = user;
        if (idTransaction) {
            try {
                for (let id in idTransaction) {
                    let book = await Book.findById(idTransaction[id].idBook);
                    let transaction = await Transaction.findById(id);
                    if (transaction.isCompleted === true) break; //Transaction Expired/Complete

                    let timeExpired = new Date(
                        new Date(transaction.createdAt).getTime() + fourteenDay
                    );

                    let timeout = `${formatDate(timeExpired).getHoursFormat}:${
                        formatDate(timeExpired).getMinutesFormat
                    } | ${formatDate(timeExpired).getDateFormat}/${
                        formatDate(timeExpired).getMonthFormat
                    }`;

                    arrTransaction.push({
                        idBook: book._id,
                        idTransaction: id,
                        title: book.title,
                        timeout,
                        avatarUrl: book.avatarUrl,
                    });
                }
            } catch (error) {
                console.log(error);
                res.render("./statusCode/status500.pug");
                return;
            }
        }

        res.render("./transactions/transaction.pug", {
            arrTransaction,
        });
    },
};
