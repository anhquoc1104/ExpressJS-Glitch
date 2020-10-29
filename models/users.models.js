const mongoose = require('../mongoose.js');

let userSchema = mongoose.Schema({
    name: String,
    email: String,
    ssn: Number,
    password: String,
    isAdmin: String,
    avatarUrl: {
        type: String,
        default: ""
    },
    createAt: Date,
    wrongLoginCount: Number,
    shopId: mongoose.Schema.Types.ObjectId,
    cart: {}
}, {
    autoCreate: true
})

let User = mongoose.model('User', userSchema, 'users');

module.exports = User;