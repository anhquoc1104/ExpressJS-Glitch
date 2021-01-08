let mongoose = require("../services/mongoose.js");

let cartSchema = mongoose.Schema(
    {
        idUser: mongoose.Schema.Types.ObjectId,
        idBook: mongoose.Schema.Types.ObjectId,
        isComplete: {
            type: String,
            default: "false",
        },
        createAt: Date,
    },
    {
        autoCreate: true,
    }
);
let Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
