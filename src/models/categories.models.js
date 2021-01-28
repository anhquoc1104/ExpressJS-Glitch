const mongoose = require("../services/mongoose.js");

let categorySchema = mongoose.Schema(
    {
        categories: Array,
    },
    {
        timestamps: true,
        autoCreate: true,
        collation: { locale: "en_US", strength: 1 },
    }
);

categorySchema.index({
    categories: "text",
});

let Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
