const mongoose = require("mongoose");
const User = require("./user")

const Product = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "You must be logged in to add new product"]
    },
    name: {
        type: String,
        required: [true, "You must enter name of product"],
        index: { unique: true }
    },
    category: {
        type: String,
        required: [true, "You must enter category of product"]
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: [true, "You must enter price of product"]
    },
    quantity: {
        type: Number,
        required: [true, "You must enter quantity"],
        default: 1
    },
    image: {
        type: String,
        required: [true, "You must enter image of the product"]
    },
    givaway: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Number,
        default: 0
    },
    recommended: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })


module.exports = mongoose.model("Product", Product);