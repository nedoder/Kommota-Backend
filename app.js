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
const admin = require("./controllers/admin");
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
app.get('/users', login.verifyToken, admin.isAdmin, userControllers.findAllUsers);
app.get("/login", login.logIn);
app.delete("/deleteuser", login.verifyToken, userControllers.deleteUser);
app.patch("/edituser", login.verifyToken, userControllers.editUser);
app.get("/userproducts", login.verifyToken, userControllers.usersProducts);
app.get("/userbyid", login.verifyToken, userControllers.findUserById);
app.get("/admin", login.verifyToken, admin.isAdmin, admin.getData);


//product routes - add, delete, findAll, edit, find product by category, filter products based on user choice

app.post("/createproduct", login.verifyToken, productControllers.createProduct);
app.get('/products', productControllers.findAllProducts);
app.get('/product/:id', login.verifyToken, productControllers.findAllProducts);
app.post("/deleteproduct", login.verifyToken, productControllers.deleteProduct);
app.post("/editproduct", login.verifyToken, productControllers.editProduct);
app.post("/findproductsbycategory", productControllers.findProductsByCategory);
app.post("/filter", productControllers.filter)



connect()
    .then(() => app.listen(process.env.PORT || 3001, () => {
        console.log("Server is running on port 3001")
    }))
    .catch(e => console.error(e))