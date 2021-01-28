let Book = require("../../models/books.models.js");
let Category = require("../../models/categories.models.js");
let pagination = require("../../services/pagination");
let onSort = require("../../services/sort");

module.exports = {
    //Search
    home: async (req, res) => {
        let sort = "DateDown";
        let isSort = onSort(sort);
        let matchQuery = [];

        try {
            let [{ categories }] = await Category.find();
            categories.sort((a, b) => {
                return a.localeCompare(b);
            });
            for (let categoryName of categories) {
                matchQuery.push({
                    categoryName,
                    books: await Book.find({
                        category: { $regex: categoryName },
                    })
                        .sort(isSort)
                        .limit(5),
                });
            }

            res.render("./admin/categories/categories.pug", {
                matchQuery,
                mess: req.flash("message"),
            });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },
    category: async (req, res) => {
        let page = req.params.page || 1;
        let sort = req.body.sort || "DateDown";
        let isSort = onSort(sort);
        let obj;
        let { categoryQuery } = req.query;

        try {
            //Check hadn't queryString
            if (!categoryQuery) {
                res.redirect("/admin/categories");
                return;
            }

            let books = await Book.find({
                category: { $regex: categoryQuery },
            }).sort(isSort);

            if (books && books.length !== 0) {
                obj = pagination(
                    page,
                    24,
                    "books",
                    books,
                    "/admin/search/page/"
                );
            }

            res.render("./admin/categories/category.pug", {
                ...obj,
                categoryName: categoryQuery,
                mess: req.flash("message"),
            });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
        }
    },
};
