const express = require("express");
const mongoose = require("mongoose");
const upload = require("express-fileupload");
var cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const passwordHash = require("password-hash/lib/password-hash");
const app = express();
const User = require("./models/user");
const Product = require("./models/product");
const shoppingCart = require("./models/shoppingCart");
const register = require("./controllers/register");
const login = require("./controllers/login");
const userControllers = require("./controllers/user");
const productControllers = require("./controllers/product");
const shopping = require("./controllers/shoppingCart");
const admin = require("./controllers/admin");
const checkout = require("./controllers/checkout");
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("uploads"));

const connect = () => {
    return mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/project");
};

//user routes - signup, login, findAll and delete

app.post("/signup", register.signupUser);
app.post('/users', login.verifyToken, admin.isAdmin, userControllers.findAllUsers);
app.post("/login", login.logIn);
app.delete("/deleteuser", login.verifyToken, userControllers.deleteUser);
app.post("/edituser", login.verifyToken, userControllers.editUser);
app.post("/userproducts", login.verifyToken, userControllers.usersProducts);
app.post("/userbyid", login.verifyToken, userControllers.findUserById);


//product routes - add, delete, findAll, edit, find product by category, filter products based on user choice

app.post("/createproduct", login.verifyToken, productControllers.createProduct);
app.get('/products', productControllers.findAllProducts);
app.post('/product/:id', login.verifyToken, productControllers.findProductById);
app.post("/deleteproduct", login.verifyToken, productControllers.deleteProduct);
app.post("/editproduct", login.verifyToken, productControllers.editProduct);
app.post("/findproductsbycategory", productControllers.findProductsByCategory);
app.post("/filter", productControllers.filter);
app.post("/recommended", productControllers.getRecommendedProducts);
app.post("/giveaway", productControllers.getGiveawayProducts);

//routes for shopping cart - add item to cart, get cart, delete cart
app.post("/cart", login.verifyToken, shopping.addItemToCart);
app.post("/carts", login.verifyToken, shopping.getCart);
app.delete("/cart", login.verifyToken, shopping.emptyCart);
app.delete("/checkout", login.verifyToken, checkout.checkout, shopping.emptyCart);


connect()
    .then(() => app.listen(process.env.PORT || 3001, () => {
        console.log("Server is running on port 3001")
    }))
    .catch(e => console.error(e))