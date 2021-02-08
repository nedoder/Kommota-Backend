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
        minlength: [5, "Minimal length of email is 5 caracters"],
        maxlength: [35, "Max length of email is 35 caracters"],
        required: [true, "You must enter email"],
        index: { unique: true },
        validate: [validator.isEmail, "You must enter valid email"]
    },
    role: {
        type: Number,
        required: [true, "You must enter role"]
    }
}, { timestamps: true })


module.exports = mongoose.model("User", User);