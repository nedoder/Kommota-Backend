const mongoose = require("mongoose");

const User = require("./user");
const Product = require("./product");

const Shopping = new mongoose.Schema({
    product: {
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
    }
}, { timestamps: true })


module.exports = mongoose.model("Shopping", Shopping);