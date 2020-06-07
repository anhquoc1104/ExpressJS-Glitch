let mongoose = require('../mongoose.js');

let shopSchema = mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId
},{
  autoCreate: true
});
let Shop = mongoose.model('Shop', shopSchema, 'shops');

module.exports = Shop;