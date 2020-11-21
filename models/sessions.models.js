let mongoose = require("../mongoose.js");

let sessionSchema = mongoose.Schema(
  {
    idCart: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    createAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    autoCreate: true,
  }
);
let Session = mongoose.model("Session", sessionSchema, "sessions");

module.exports = Session;
