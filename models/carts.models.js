let mongoose = require("../mongoose.js");

let cartSchema = mongoose.Schema(
  {
    idUser: mongoose.Schema.Types.ObjectId,
    idBook: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      default: "true",
    },
    createAt: Date,
  },
  {
    autoCreate: true,
  }
);
let Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
