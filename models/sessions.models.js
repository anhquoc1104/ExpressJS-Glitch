let mongoose = require('../mongoose.js');

let sessionSchema = mongoose.Schema({
    cart: {}
}, {
    autoCreate: true
});
let Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;