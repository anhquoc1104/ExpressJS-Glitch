let Book = require("../../models/books.models.js");
let User = require("../../models/users.models.js");
let pagination = require("../../services/pagination");
let onSort = require("../../services/sort");

module.exports = {
    //Search
    search: async (req, res) => {
        let { page } = req.params || 1;
        let { allQuery, authorQuery, publisherQuery, yearQuery } = req.query;
        // let { userId } = req.signedCookies;
        // let user = userId && (await User.findById(userId));
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        let matchQuery;
        let objUsers;
        let obj;

        if (allQuery) {
            // allQuery = allQuery.trim();
            matchQuery = await Book.find({
                $text: { $search: `${allQuery}` },
            }).sort(isSort);
            let userQuery = await User.find()
                .or([
                    { email: { $regex: allQuery } },
                    { name: { $regex: allQuery } },
                    { phone: { $regex: allQuery } },
                    { ssn: { $regex: allQuery } },
                    { address: { $regex: allQuery } },
                ])
                .sort(isSort);
            if (userQuery && userQuery.length !== 0) {
                objUsers = pagination(
                    page,
                    24,
                    "users",
                    userQuery,
                    "/admin/search/page/"
                );
            }
        } else if (authorQuery) {
            matchQuery = await Book.find({
                author: { $regex: authorQuery },
            }).sort(isSort);
        } else if (yearQuery) {
            matchQuery = await Book.find({ year: { $regex: yearQuery } }).sort(
                isSort
            );
        } else if (publisherQuery) {
            matchQuery = await Book.find({
                publisher: { $regex: publisherQuery },
            }).sort(isSort);
        } else {
            let userQuery = await User.find();
            matchQuery = await Book.find();
            objUsers = pagination(
                page,
                24,
                "users",
                userQuery,
                "/admin/search/page/"
            );
        }

        if (matchQuery && matchQuery.length !== 0) {
            obj = pagination(
                page,
                24,
                "books",
                matchQuery,
                "/admin/search/page/"
            );
        }

        res.render("./admin/search.pug", { ...objUsers, ...obj });
    },
};
