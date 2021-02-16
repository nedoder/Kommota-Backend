const mongoose = require("mongoose");
const validator = require("validator");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must enter Your name"]
    },
    lastName: {
        type: String,
        required: [true, "You must enter Your last name"]
    },

    password: {
        type: String,
        required: [true, "You must enter password"],
    },
    email: {
        type: String,
        required: [true, "You must enter email"],
        index: { unique: true },
        validate: [validator.isEmail, "You must enter valid email"]
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