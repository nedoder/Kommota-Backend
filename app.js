
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
const Wishlist = require("./models/wishlist");
const register = require("./controllers/register");
const login = require("./controllers/login");
const userControllers = require("./controllers/user");
const productControllers = require("./controllers/product");
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(cors());
app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("uploads"));

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/project");
};

//user routes - signup, login, findAll and delete

app.post("/signup", register.signupUser);
app.get('/users', login.verifyToken, userControllers.findAllUsers);
app.get("/login", login.logIn);
app.delete("/deleteuser", login.verifyToken, userControllers.deleteUser);
app.patch("/edituser", login.verifyToken, userControllers.editUser);
app.get("/userproducts", userControllers.usersProducts);

//product routes - add, delete, findAll, edit

app.post("/createproduct", productControllers.createProduct);
app.get('/products', productControllers.findAllProducts);
app.post("/deleteproduct", productControllers.deleteProduct);
app.post("/editproduct", productControllers.editProduct);

connect()
    .then(() => app.listen(3001, () => {
        console.log("Server is running on port 3001")
    }))
    .catch(e => console.error(e))
