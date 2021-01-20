const mongoose = require("../services/mongoose.js");

let userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name must be required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email must be required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: String,
        password: {
            type: String,
            required: [true, "Password must be required"],
            trim: true,
            minlength: [6, "Password must be at least 6 characters"],
        },
        birthdate: Date,
        address: {
            type: String,
            trim: true,
        },
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
        timestamps: true,
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
