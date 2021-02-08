const User = require("../models/user");

function signupUser(newUser) {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.create(newUser))
        } catch (error) {
            reject(false)
        }

    })
}

function findAllUsers() {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({}).lean().exec())
        } catch (error) {
            reject(false)
        }

    })
}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.deleteOne({ _id: id }).exec())
        } catch (error) {
            reject(false)
        }

    })
}

module.exports = {
    signupUser,
    findAllUsers,
    deleteUser
}