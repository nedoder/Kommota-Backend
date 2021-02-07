const mongoose = require("mongoose");
const User = require("./user")
const Product = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "You must enter name of product"],
        minlength: [3, "Minimal length of product name is 3 characters"],
        maxlength: [20, "Max length of product name is 20 characters"],
        index: { unique: true }
    },
    category: {
        type: String,
        required: [true, "You must enter category of product"],
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        min: [1, "Minimal price of product is 1 euro"],
        max: [10000, "Max price of product is 10000 euro"],
        required: [true, "You must enter price of product"],
    },
    quantity: {
        type: Number,
        required: [true, "You must enter quantity"],
        min: [1, "Minimal quantity of product is 1"],
        max: [10, "Max quantity of product is 10"],
        default: 1
    },
    image: {
        type: String,
    }


}, { timestamps: true })


module.exports = mongoose.model("Product", Product);