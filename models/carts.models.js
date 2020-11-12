let mongoose = require("../mongoose.js");

let sessionSchema = mongoose.Schema(
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
let Session = mongoose.model("Session", sessionSchema, "sessions");

module.exports = Session;
