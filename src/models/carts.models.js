let mongoose = require("../services/mongoose.js");

let cartSchema = mongoose.Schema(
    {
        idUser: mongoose.Schema.Types.ObjectId,
        idBook: mongoose.Schema.Types.ObjectId,
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
    }
);
let Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
