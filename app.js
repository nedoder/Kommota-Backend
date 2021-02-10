
const express = require("express");
const mongoose = require("mongoose");
const upload = require("express-fileupload");
var cors = require("cors");
const bodyParser = require("body-parser");
const passwordHash = require("password-hash/lib/password-hash");
const app = express();
const User = require("./models/user");
const Product = require("./models/product");
const Wishlist = require("./models/wishlist")
const userControllers = require("./controllers/user");
const productControllers = require("./controllers/product");

app.use(cors());
app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("uploads"))

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/project");
};

//user routes - signup, login, findAll and delete

app.post("/signup", userControllers.signupUser);
app.get('/users', userControllers.findAllUsers);
app.post("/login", userControllers.loginUser);
app.post("/deleteuser", userControllers.deleteUser);

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
