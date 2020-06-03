let mongoose = require('../mongoose.js');

let sessionSchema = mongoose.Schema({
  cart: {}
});
let Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;