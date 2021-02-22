const ShoppingCart = require("../models/shoppingCart");
const Product = require("../controllers/product");

const findItem = async function(req, res) {
    const cart = await ShoppingCart.find().populate({
        path: "items.productId",
        select: "name price total"
    });;
    return cart[0];
};

const addItem = async function(req, res) {
    const newItem = await ShoppingCart.create(req);
    return newItem
}


const addItemToCart = async function(req, res) {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    try {
        let cart = await findItem();
        let productDetails = await Product.findProductById;
        if (!productDetails) {
            return res.status(500).json({
                type: "Nije pronađeno",
                msg: "Nije validan zahtjev"
            })
        }
        if (cart) {
            const indexFound = cart.items.findIndex(item => item.productId.id == productId);
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            } else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            } else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            } else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request"
                })
            }
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        } else {
            const cartData = {
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity)
            }
            cart = await addItem()
            res.json(cart);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}
const getCart = async function(req, res) {
    try {
        let cart = await findItem()
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart not found",
            })
        }
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}
const emptyCart = async function(req, res) {
    try {
        let cart = await findItem();
        cart.items = [];
        cart.subTotal = 0
        let data = await cart.save();
        res.status(200).json({
            type: "Success",
            mgs: "Cart has been emptied",
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}

module.exports = {
    findItem,
    addItem,
    addItemToCart,
    getCart,
    emptyCart

}