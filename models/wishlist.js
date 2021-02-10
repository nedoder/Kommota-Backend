const mongoose = require("mongoose");

const User = require("./user");
const Product = require("./product");

const Wishlist = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "You must select a product to add to wishlist"],
        quantity: 1,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "You must be logged in to add new product to wishlist"]

    },
}, { timestamps: true })


module.exports = mongoose.model("Wishlist", Wishlist);