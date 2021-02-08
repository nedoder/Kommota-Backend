const express = require("express");
const mongoose = require("mongoose");
const upload = require("express-fileupload");
var cors = require("cors");
const bodyParser = require("body-parser");
const passwordHash = require("password-hash/lib/password-hash");
const app = express();
const User = require("./models/user");
const Product = require("./models/product");
const userControllers = require("./cotrollers/usercontroller");
const productControllers = require("./cotrollers/productcontrollers")



app.use(cors());
app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("uploads"))
const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/project");
};

//user routes - signup, login, findAll and delete

app.post("/signup", async(req, res) => {
    let userEmail = req.body.email;
    const newUser = req.body;
    try {
        const emailExist = await User.find({ email: userEmail }).exec();
        if (emailExist.length > 0) {
            throw "This email already exists in database. ";
        } else {
            const user = await userControllers.signupUser(newUser)
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error)
        res.json({ error: error });

    }
})

app.get('/users', async(req, res) => {
    const users = await userControllers.findAllUsers();
    try {
        if (users.length === 0) {
            throw "There are no users in database. ";
        } else {
            res.status(201).json(users);
        }
    } catch (error) {
        console.log(error)
        res.json({ error: error });

    }
})

app.post("/login", async(req, res) => {
    let userMail = req.body.email;
    let password = req.body.password;
    try {
        const user = await User.find({ email: userMail }).exec();
        if (user.length === 0) {
            throw "User does not exist in database. ";
        } else if (user.length === 1) {
            if (password === user[0].password) {
                res.status(201).json(user[0]._id);
            } else {
                throw "Invalid password. ";
            }
        }
    } catch (err) {
        console.log(err);
        res.json({ error: err });
    }

})

app.post("/deleteuser", async(req, res) => {
    let id = req.body.id;
    try {
        const user = await userControllers.deleteUser(id);
        console.log(user);
        if (user.n === 0) { throw "User does not exist in db" } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }
})

//product routes - add, delete, findAll, edit

app.post("/createproduct", async(req, res) => {
    let price = req.body.price;
    let name = req.body.name;
    try {
        if (!price || !name) {
            throw "You must enter name and price"
        }
    } catch (error) {
        res.json({ error: error });
    }
    if (req.body.description !== "") {
        try {
            if (req.body.description.length < 10 || req.body.description.length > 150) {
                throw "Product description should not be shorter than 10 characters and longer than 150 characters. ";
            }
        } catch (error) {
            res.json({ error: error });
        }
    }
    try {
        let productName = req.body.name;
        const productExist = await Product.find({ name: productName }).exec();
        if (productExist.length === 1) {
            throw "This product name already exists in database. ";
        }
    } catch (error) {
        res.json({ error: error });
    }
    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        console.log("nema");
        let filePath = __dirname + "/uploads/" + "noimage.png";
        req.body.image = filePath;
        let newProduct = req.body;
        console.log(newProduct)
        try {
            const product = await productControllers.createProduct(newProduct);
            res.status(201).json(product);
        } catch (error) {
            console.log(error);
            res.json({ error: error });

        }
    } else {
        let file = req.files.image;
        let fileName = req.files.image.name;
        file.mv('./uploads/' + fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                async function upis() {
                    let filePath = __dirname + "/uploads/" + fileName;
                    req.body.image = filePath;
                    let newProduct = req.body;
                    try {
                        const product = await productControllers.createProduct(newProduct);
                        res.status(201).json(product);
                    } catch (error) {
                        console.log(error);
                        res.json({ error: error });

                    }
                }
                upis();
            }
        })
    }

})

app.get('/products', async(req, res) => {
    const products = await productControllers.findAllProducts();
    try {
        if (products.length === 0) {
            throw "There are no products in database. ";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        res.json({ error: error });
    }
})

app.post("/deleteproduct", async(req, res) => {
    let id = req.body.id;
    try {
        const product = await productControllers.deleteProduct(id);
        if (product.n === 0) { throw "Product does not exist in db" } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }
})

app.post("/editproduct", async(req, res) => {
    let id = req.body.id;
    console.log(id);
    if (req.body.description !== "") {
        try {
            if (req.body.description.length < 10 || req.body.description.length > 150) {
                throw "Product description should not be shorter than 10 characters and longer than 150 characters. ";
            }
        } catch (error) {
            console.log(error);
            res.json({ error: error });
        }
    }

    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        console.log("nema");
        let filePath = __dirname + "/uploads/" + "noimage.png";
        req.body.image = filePath;
        let newProduct = req.body;
        console.log(newProduct)
        try {
            const product = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true, upsert: true, setDefaultsOnInsert: true });
            console.log(product);
            res.status(201).json(product);
        } catch (error) {
            console.log(error);
            res.json({ error: error });

        }
    } else {
        let file = req.files.image;
        let fileName = req.files.image.name;
        file.mv('./uploads/' + fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                async function upis() {
                    let filePath = __dirname + "/uploads/" + fileName;
                    req.body.image = filePath;
                    let newProduct = req.body;
                    try {
                        const product = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true, upsert: true, setDefaultsOnInsert: true });
                        console.log(product)
                        res.status(201).json(product);
                    } catch (error) {
                        console.log(error);
                        res.json({ error: error });

                    }
                }
                upis();
            }
        })
    }

})

connect()
    .then(() => app.listen(3001, () => {
        console.log("Server is running on port 3001")
    }))
    .catch(e => console.error(e))