const mongoose = require('../mongoose.js');

let bookSchema = mongoose.Schema({
  title: String,
  description: String,
  userID: mongoose.Schema.Types.ObjectId,
  avatarUrl: {
    type: String,
    default: ""
  }
})

let Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;