let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let Cart = require("../../models/carts.models.js");
let Transaction = require("../../models/transactions.models.js");
let formatDate = require("../../services/formatDate");

let pagination = require("../../services/pagination");
let onSort = require("../../services/sort");
let Constant = require("../../services/constant");

module.exports = {
    viewAdmin: async (req, res) => {
        try {
            let user = await User.findById(req.signedCookies.userId);

            res.render("./admin/users/view.users.pug", {
                user,
                mess: req.flash("message"),
            });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },

    allUsers: async (req, res) => {
        let { page } = req.params || 1;
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        try {
            let users = await User.find({ isAdmin: false }).sort(isSort);
            let obj = pagination(
                page,
                24,
                "users",
                users,
                "/admin/users/page/"
            );
            res.render("./admin/users/home.users.pug", obj);
        } catch (error) {
            console.log(error);
        }
    },

    viewUser: async (req, res) => {
        let { id } = req.params;
        let user = await User.findById(id);
        let arrCart = [];
        let arrTransaction = [];
        let { idCart, idTransaction } = user;
        try {
            if (idCart) {
                for (let id in idCart) {
                    let book = await Book.findById(idCart[id].idBook);
                    let cart = await Cart.findById(id);
                    if (cart.isCompleted === true) break; //Cart Expired/Complete

                    let timeExpired = new Date(
                        new Date(cart.createdAt).getTime() +
                            Constant.TWO_DAYS_MILI
                    );

                    let timeout = `${formatDate(timeExpired).getHoursFormat}:${
                        formatDate(timeExpired).getMinutesFormat
                    } | ${formatDate(timeExpired).getDateFormat}/${
                        formatDate(timeExpired).getMonthFormat
                    }`;

                    arrCart.push({
                        idBook: book._id,
                        idCart: id,
                        title: book.title,
                        timeout,
                        avatarUrl: book.avatarUrl,
                    });
                }
            }
            if (idTransaction) {
                for (let id in idTransaction) {
                    let book = await Book.findById(idTransaction[id].idBook);
                    let transaction = await Transaction.findById(id);
                    if (transaction.isCompleted === true) break; //Transaction Expired/Complete

                    let timeExpired = new Date(
                        new Date(transaction.createdAt).getTime() +
                            Constant.FOURTEEN_DAYS_MILI
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
            }
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
            return;
        }
        res.render("./admin/users/view.users.pug", {
            user,
            arrCart,
            arrTransaction,
            mess: req.flash("message"),
        });
    },

    editInfoPost: async (req, res) => {
        let { name, phone, birthdate, address } = req.body;
        let idUser = req.signedCookies.userId;
        let regexPhone = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im;
        /*
        // Valid formats:
        (123) 456-7890
        (123)456-7890
        123-456-7890
        123.456.7890
        1234567890
        +31636363634
        075-63546725
        */
        try {
            //Change Info
            let user = await User.findById(idUser);
            let avatarUrl = user.avatarUrl;
            let file = req.file;

            //name not Empty
            if (name === "") name = user.name;
            if (birthdate === "") birthdate = user.birthdate;

            //noChange
            if (
                name === user.name &&
                phone === user.phone &&
                birthdate === user.birthdate &&
                address === user.address &&
                !file
            ) {
                req.flash("message", Constant.SUCCESS_COMMON);
                res.redirect("/admin/users");
                return;
            }

            // Change avatar
            if (file) {
                await cloudinary
                    .uploadCloudinary(file.path, 150, 150, 75)
                    .then(async (result) => {
                        return (avatarUrl = result.url);
                    })
                    .catch((err) => {
                        console.log(err + "");
                    });
            }

            //Validate Phone Number
            if (!regexPhone.test(phone)) {
                phone = "";
            }

            await User.findOneAndUpdate(
                { _id: idUser },
                { name, phone, birthdate, address, avatarUrl }
            );
            req.flash("message", Constant.SUCCESS_COMMON);
            res.redirect("/admin/users");
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },

    editPasswordPost: async (req, res) => {
        let { oldPassword, newPassword, retypePassword } = req.body;
        let idUser = req.signedCookies.userId;
        let user = await User.findById(idUser);

        //Change Password
        if (!oldPassword || !newPassword || !retypePassword) {
            req.flash("message", Constant.ERROR_FIELD_EMPTY);
            res.redirect("/admin/users");
            return;
        }
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            req.flash("message", Constant.ERROR_PASSWORD_WRONG);
            res.redirect("/admin/users");
            return;
        }
        if (newPassword !== retypePassword) {
            req.flash("message", Constant.ERROR_PASSWORD_NOT_MATCH);
            res.redirect("/admin/users");
            return;
        }
        let password = bcrypt.hashSync(retypePassword, 10);
        await User.findOneAndUpdate({ _id: idUser }, { password });
        req.flash("message", Constant.SUCCESS_COMMON);
        res.redirect("/admin/users");
        return;
    },
};
