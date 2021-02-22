const mongoose = require("mongoose");
const User = require("./user")

const Product = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Morate biti ulogovani da dodate novi proizvod"]
    },
    name: {
        type: String,
        required: [true, "Morate unijeti ime proizvoda"],
        index: { unique: true }
    },
    category: {
        type: String,
        required: [true, "Morate unijeti kategoriju proizvoda"]
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: [true, "Morate unijeti cijenu proizvoda"]
    },
    quantity: {
        type: Number,
        required: [true, "Morate unijeti količinu"],
        default: 1
    },
    image: {
        type: String,
        required: [true, "Morate unijeti sliku proizvoda"]
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