const mongoose = require("../services/mongoose.js");

let bookSchema = mongoose.Schema(
    {
        title: String,
        description: String,
        idUser: [mongoose.Schema.Types.ObjectId],
        createAt: {
            type: Date,
            default: new Date(),
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        quantity: Number,
        author: String,
        year: String,
        publisher: String,
        category: String,
        status: {
            type: String,
            default: "true",
        },
    },
    {
        autoCreate: true,
        collation: { locale: "en_US", strength: 1 },
    }
);

bookSchema.index({
    title: "text",
    author: "text",
    publisher: "text",
    year: "text",
});

let Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;
