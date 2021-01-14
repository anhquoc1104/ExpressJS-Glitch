let mongoose = require("../services/mongoose.js");

let cartSchema = mongoose.Schema(
    {
        idUser: mongoose.Schema.Types.ObjectId,
        idBook: mongoose.Schema.Types.ObjectId,
        createdAt: {
            type: Date,
            default: new Date(),
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
        expired: {
            type: Boolean,
            default: false,
        },
    },
    {
        autoCreate: true,
    }
);
let Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
