
let path = require('path');

const crypto = require("crypto");

const User = require("../models/user");
const Product = require("../models/product");

async function findAllUsers(req, res) {
    const users = await User.find({}).lean().exec();
    users.map(user => user.password = undefined);
    try {
        if (users.length === 0) {
            throw "There are no users in database. ";
        } else {
            res.status(201).json(users);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error });

    }
};

async function deleteUser(req, res) {
    let id = req.body.id;
    try {

        const user = await User.deleteOne({ _id: id }).exec();
        console.log(user);
        if (user.length === 0) { throw "User does not exist in db" } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })

    }

};

async function editUser(req, res) {
    let id = req.body.id;
    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        let filePath = __dirname + "/uploads/" + "dafaultavatar.png";
        req.body.avatar = filePath;
        req.body["password"] = crypto.createHash('sha256').update(req.body["password"]).digest('hex');
        let newUser = req.body;
        try {
            const user = await User.findOneAndUpdate({ _id: id }, newUser, { new: true, upsert: true, setDefaultsOnInsert: true });
            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.json({ error: error });

        }
    } else {
        let file = req.files.avatar;
        let fileName = Date.now() + req.files.avatar.name;
        file.mv('./uploads/' + fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                async function uploadAvatar() {
                    let filePath = __dirname + "/uploads/" + fileName;
                    req.body.avatar = filePath;
                    let newUser = req.body;
                    try {
                        const user = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true, upsert: true, setDefaultsOnInsert: true });
                        res.status(201).json(user);
                    } catch (error) {
                        console.log(error);
                        res.json({ error: error });
                    }
                }
                uploadAvatar();
            }
        })
    }
};

async function usersProducts(req, res) {
    let id = req.body.id;
    try {
        const products = await Product.find({ userid: id }).exec();
        if (products.length === 0) {
            throw "There are no products for this user in database. ";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }

};

module.exports = {
    findAllUsers,
    deleteUser,
    editUser,
    usersProducts
}