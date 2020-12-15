let Book = require("../../models/books.models.js");
let User = require("../../models/users.models.js");
// const change_alias = require("../../services/changeAlias");
let pagination = require("../../services/pagination");
let cloudinary = require("../avatar.controller.js");

let onSort = (sort) => {
  switch (sort) {
    case "DateUp":
      return { createAt: 1 };
    case "DateDown":
      return { createAt: -1 };
    case "NameUp":
      return { title: 1 };
    case "NameDown":
      return { title: -1 };
    default:
      return { createAt: 1 };
  }
};

module.exports = {
  home: async (req, res) => {
    let { page } = req.params || 1;
    let { sort } = req.body || "DateUp";
    let isSort = onSort(sort);
    let books = await Book.find().sort(isSort);
    let obj = pagination(
      "user",
      page,
      24,
      "books",
      books,
      "/admin/books/page/"
    );
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
    let userId = req.signedCookies.userId;
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
      userId,
      description,
      createAt: new Date(),
      avatarUrl,
    });
    newBook.save();
    req.flash("sucess", "SUCESS!");
    res.redirect(url);
  },

  //Search
  search: async (req, res) => {
    let page = 1;
    let { allQuery, authorQuery, publisherQuery, yearQuery } = req.query;
    let { userId } = req.signedCookies;
    let user = userId && (await User.findById(userId));
    let { sort } = req.body || "DateUp";
    let isSort = onSort(sort);
    let matchQuery;

    if (allQuery) {
      // allQuery = allQuery.trim();
      matchQuery = await Book.find({ $text: { $search: `${allQuery}` } }).sort(
        isSort
      );
    } else if (authorQuery) {
      matchQuery = await Book.find({ author: { $regex: authorQuery } }).sort(
        isSort
      );
    } else if (yearQuery) {
      matchQuery = await Book.find({ year: { $regex: yearQuery } }).sort(
        isSort
      );
    } else if (publisherQuery) {
      matchQuery = await Book.find({
        publisher: { $regex: publisherQuery },
      }).sort(isSort);
    } else {
      matchQuery = await Book.find();
    }

    let obj = pagination(
      user,
      page,
      8,
      "books",
      matchQuery,
      "/admin/books/page/"
    );
    res.render("./admin/books/home.books.pug", obj);
  },

  //View
  view: async (req, res) => {
    let book = await Book.findById(req.params.id);
    res.render("./books/view.pug", { book });
  },

  //Edit
  edit: async (req, res) => {
    let bookId = req.params.id;
    let book = await Book.findById(bookId);
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
