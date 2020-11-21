const mongoose = require("../mongoose.js");

let bookSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    userId: [mongoose.Schema.Types.ObjectId],
    createAt: {
      type: Date,
      default: new Date(),
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    quantity: Number,
    author: String,
    year: Number,
    publisher: String,
    category: String,
    status: {
      type: String,
      default: "true",
    },
  },
  {
    autoCreate: true,
  }
);

let Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;
