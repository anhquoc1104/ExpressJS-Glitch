const mongoose = require('../mongoose.js');

let userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: String,
  avatarUrl: String,
  wrongLoginCount: Number,
  shopID: mongoose.Schema.Types.ObjectId,
  cart: {}
})

let User = mongoose.model('User', userSchema, 'users');

module.exports = User;