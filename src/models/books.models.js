const mongoose = require("../services/mongoose.js");

let bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        idUser: [mongoose.Schema.Types.ObjectId],
        avatarUrl: {
            type: String,
            default: "",
        },
        quantity: Number,
        author: {
            type: String,
            trim: true,
        },
        year: {
            type: String,
            trim: true,
        },
        publisher: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
        collation: { locale: "en_US", strength: 1 },
    }
);

bookSchema.index({
    title: "text",
    author: "text",
    publisher: "text",
    year: "text",
    category: "text",
});

let Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;
