const mongoose = require("mongoose");
const validator = require("validator");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Morate unijeti ime"]
    },
    lastName: {
        type: String,
        required: [true, "Morate unijeti prezime"]
    },

    password: {
        type: String,
        required: [true, "Morate unijeti password"],
    },
    email: {
        type: String,
        required: [true, "Morate unijeti email"],
        index: { unique: true },
        validate: [validator.isEmail, "Morate unijeti validan email"]
    },
    role: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ""
    }
}, { timestamps: true })


module.exports = mongoose.model("User", User);