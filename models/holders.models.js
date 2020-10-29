let mongoose = require('../mongoose.js');

let holderSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    bookId: mongoose.Schema.Types.ObjectId,
    createAt: Date,
}, {
    autoCreate: true
});
let Holder = mongoose.model('Holder', holderSchema, 'Holder');

module.exports = Holder;