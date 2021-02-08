const mongoose = require("mongoose");

const Wishlist = new mongoose.Schema({
    type: {
        name: String
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
}, { timestamps: true })


module.exports = mongoose.model("Wishlist", Wishlist);