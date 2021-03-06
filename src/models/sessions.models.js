let mongoose = require("../services/mongoose.js");

let sessionSchema = mongoose.Schema(
    {
        idCart: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },
    },
    {
        timestamps: true,
        autoCreate: true,
    }
);
let Session = mongoose.model("Session", sessionSchema, "sessions");

module.exports = Session;
