let Book = require("../../models/books.models.js");
let Category = require("../../models/categories.models.js");

let cloudinary = require("../avatar.controller.js");

let pagination = require("../../services/pagination");
let onSort = require("../../services/sort");
let formatDate = require("../../services/formatDate");
let Constant = require("../../services/constant");
let changeAlias = require("../../services/changeAlias");

module.exports = {
    home: async (req, res) => {
        let page = req.paramspage || 1;
        let sort = req.body.sort || "DateDown";
        let isSort = onSort(sort);
        try {
            let books = await Book.find({ status: true }).sort(isSort);
            let [{ categories }] = await Category.find();
            let obj = pagination(
                page,
                24,
                "books",
                books,
                "/admin/books/page/"
            );
            res.render("./admin/books/home.books.pug", {
                ...obj,
                categories,
                mess: req.flash("message"),
            });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },
    //Create
    createPost: async (req, res) => {
        let {
            url,
            title,
            author,
            year,
            quantity,
            publisher,
            category,
            description,
        } = req.body;
        if (title === "") {
            req.flash("message", Constant.ERROR_BOOK_ADD);
            res.redirect(url);
            return;
        }
        let avatarUrl = "";
        let { userId } = req.signedCookies;
        try {
            let book = await Book.findOne({ title: { $regex: title } });
            if (book) {
                req.flash("message", Constant.ERROR_BOOK_EXIST);
                res.redirect(url);
                return;
            }
            if (req.file) {
                await cloudinary
                    .uploadCloudinary(req.file.path, 250, 300, 5)
                    .then((result) => {
                        avatarUrl = result.url;
                        return avatarUrl;
                    })
                    .catch((err) => {
                        console.log(err + "");
                    });
            }

            //Check categories
            let categories = await Category.find();
            let hadCategory = categories[0].categories.find((elm) => {
                return changeAlias(elm) === changeAlias(category);
            });
            if (!hadCategory) {
                categories[0].categories.push(category);
                await Category.findByIdAndUpdate(categories[0]._id, {
                    categories: categories[0].categories,
                });
            } else {
                category = hadCategory;
            }

            //Format quantity
            quantity = quantity ? quantity : 0;
            // if (title === "") title = "No Title";
            // if (description === "") description = "No Description";

            let newBook = new Book({
                title,
                author,
                year,
                quantity,
                publisher,
                category,
                idUser: userId,
                description,
                createAt: new Date(),
                avatarUrl,
            });
            newBook.save();
            req.flash("message", Constant.SUCCESS_COMMON);
            res.redirect(url);
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },

    //View
    view: async (req, res) => {
        try {
            let book = await Book.findById(req.params.id);
            res.render("./admin/books/view.books.pug", { book });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },

    //Edit
    edit: async (req, res) => {
        let idBook = req.params.id;
        let book = await Book.findById(idBook);
        res.render("./books/edit.pug", { book });
    },

    editPost: async (req, res) => {
        let {
            url,
            idBook,
            title,
            author,
            year,
            quantity,
            publisher,
            category,
            description,
        } = req.body;
        try {
            let book = await Book.findById({ _id: idBook });
            let avatarUrl = "";

            //Check categories
            let categories = await Category.find();
            let hadCategory = categories[0].categories.find((elm) => {
                return changeAlias(elm) === changeAlias(category);
            });
            if (!hadCategory) {
                categories[0].categories.push(category);
                await Category.findByIdAndUpdate(categories[0]._id, {
                    categories: categories[0].categories,
                });
            } else {
                category = hadCategory;
            }
            //Check title
            title = title ? title : book.title;

            //Check Avatar

            avatarUrl = req.file
                ? await cloudinary
                      .uploadCloudinary(req.file.path, 250, 300, 5)
                      .then((result) => {
                          avatarUrl = result.url;
                          return avatarUrl;
                      })
                      .catch((err) => {
                          console.log(err + "");
                      })
                : book.avatarUrl;

            await Book.findOneAndUpdate(
                { _id: idBook },
                {
                    title,
                    author,
                    year,
                    quantity,
                    publisher,
                    category,
                    description,
                    avatarUrl,
                }
            );
            req.flash("message", Constant.SUCCESS_COMMON);
            res.redirect(url);
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },

    //Delete
    remove: async (req, res) => {
        let id = req.params.id;
        await Book.findOneAndDelete({ _id: id });
        res.redirect("/");
    },
};
