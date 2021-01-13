const mongoose = require("../services/mongoose.js");

let userSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        ssn: String,
        phone: String,
        password: String,
        birthdate: Date,
        address: String,
        status: {
            type: String,
            default: "true",
        },
        isAdmin: {
            type: String,
            default: "false",
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        createAt: {
            type: Date,
            default: new Date(),
        },
        wrongLoginCount: Number,
        idTransaction: {
            type: {},
            default: {},
        },
        idCart: {
            type: {},
            default: {},
        },
    },
    {
        autoCreate: true,
        collation: { locale: "en_US", strength: 1 },
    }
);

userSchema.index({
    email: "text",
    name: "text",
    phone: "text",
    ssn: "text",
    address: "text",
});

let User = mongoose.model("User", userSchema, "users");

module.exports = User;
