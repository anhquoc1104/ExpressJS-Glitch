let Book = require("../../models/books.models.js");

let cloudinary = require("../avatar.controller.js");

let pagination = require("../../services/pagination");
let onSort = require("../../services/sort");
let Constant = require("../../services/constant");

module.exports = {
    home: async (req, res) => {
        let { page } = req.params || 1;
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        let books = await Book.find().sort(isSort);
        let obj = pagination(page, 24, "books", books, "/admin/books/page/");
        res.render("./admin/books/home.books.pug", {
            ...obj,
            mess: req.flash("sucess"),
        });
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
            res.redirect(url);
            return;
        }
        let avatarUrl = "";
        let { userId } = req.signedCookies;
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

        quantity === "" ? "0" : quantity;
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
        req.flash("sucess", "SUCESS!");
        res.redirect(url);
    },

    //View
    view: async (req, res) => {
        let book = await Book.findById(req.params.id);
        res.render("./admin/books/view.books.pug", { book });
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
        // let idBook = req.params.idBook;
        // if (title === "") title = "No Title";
        // if (author === "") author = "---";
        // if (year === "") year = 0;
        // if (category === "") category = "---";
        // if (quantity === "") quantity = 0;
        // if (publisher === "") publisher = "---";
        // if (description === "") description = "No Description";
        if (!req.file) {
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
                }
            );
            res.redirect(url);
            return;
        }
        let avatarUrl = "";
        await cloudinary
            .uploadCloudinary(req.file.path, 250, 300, 5)
            .then((result) => {
                avatarUrl = result.url;
                return avatarUrl;
            })
            .catch((err) => {
                console.log(err + "");
            });
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
        res.redirect(url);
    },

    //Delete
    remove: async (req, res) => {
        let id = req.params.id;
        await Book.findOneAndDelete({ _id: id });
        res.redirect("/");
    },
};
