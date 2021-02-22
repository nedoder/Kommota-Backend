const mongoose = require("mongoose");

const User = require("./user");
const Product = require("./product");

let ShoppingItem = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Morate odabrati proizvod"],
        quantity: 1,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Morate biti ulogovani da biste dodali proizvod u korpu."]

    },
    quantity: {
        type: Number,
        required: [true, "Morate unijeti količinu"],
        min: [1, "Količina ne može biti manja od 1"]
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const ShoppingCart = new mongoose.Schema({
    items: [ShoppingItem],
    subTotal: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("ShoppingCart", ShoppingCart);