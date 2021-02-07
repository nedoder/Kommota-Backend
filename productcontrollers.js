const Product = require("../models/product");

function createProduct(newProduct) {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.create(newProduct))
        } catch (error) {
            reject(false)
        }

    })
}

function findAllProducts() {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.find({}).lean().exec())
        } catch (error) {
            reject(false)
        }

    })
}

function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.deleteOne({ _id: id }).exec())
        } catch (error) {
            reject(false)
        }

    })
}

module.exports = {
    createProduct,
    findAllProducts,
    deleteProduct
}