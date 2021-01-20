let User = require("../../models/users.models");
let Book = require("../../models/books.models");
let Cart = require("../../models/carts.models");
let Transaction = require("../../models/transactions.models");

let Constant = require("../constant");

let checkCartExpiredDay = new Date(
    new Date().getTime() - Constant.TWO_DAYS_MILI
);
let checkTransactionExpiredDay = new Date(
    new Date().getTime() - Constant.FOURTEEN_DAYS_MILI
);

module.exports = {
    checkCartExpired: async () => {
        try {
            await Cart.find(
                {
                    isCompleted: false,
                    createdAt: { $lte: checkCartExpiredDay },
                },
                async function (err, carts) {
                    if (!err) {
                        for (let cart of carts) {
                            await Book.findByIdAndUpdate(cart.idBook, {
                                $inc: { quantity: 1 },
                            });
                            cart.isCompleted = true;
                            cart.isExpired = true;
                            await cart.save();

                            //remove idCart From User
                            let { idUser } = cart;
                            let user = await User.findById(idUser);
                            let idCartFromUser = Object.assign({}, user.idCart);
                            delete idCartFromUser[cart._id];
                            await User.findByIdAndUpdate(idUser, {
                                idCart: idCartFromUser,
                            });
                        }
                        return;
                    }
                    console.log(err);
                }
            );
        } catch (error) {
            console.log("Check Cart Expired, error: " + error);
        }
    },
    checkTransactionExpired: async () => {
        try {
            await Transaction.find(
                {
                    isCompleted: false,
                    createdAt: { $lte: checkTransactionExpiredDay },
                },
                async function (err, transactions) {
                    if (!err) {
                        for (let transaction of transactions) {
                            await User.findByIdAndUpdate(transaction.idUser, {
                                status: "block",
                            });
                        }
                        return;
                    }
                    console.log(err);
                }
            );
        } catch (error) {
            console.log("Check Cart Expired, error: " + error);
        }
    },
};
