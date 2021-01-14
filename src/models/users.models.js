const mongoose = require("../services/mongoose.js");

let userSchema = mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
        },
        phone: String,
        password: {
            type: String,
            required: true,
        },
        birthdate: Date,
        address: String,
        status: {
            type: String,
            default: "pending",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        createAt: {
            type: Date,
            default: new Date(),
        },
        wrongLoginCount: {
            type: Number,
            expires: "60 * 15",
        },
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
