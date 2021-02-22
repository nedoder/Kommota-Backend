let path = require('path');
const Product = require("../models/product");


const crypto = require("crypto");

const User = require("../models/user");

const fs = require("fs");
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const key = require('../auth.json')
const auth = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES)


const drive = google.drive({ version: "v3", auth });

const findUserById = async function(req, res) {
    try {
        const id = req.body.id;
        console.log(typeof id);
        const user = await User.find({ _id: id }).exec();
        res.status(200).json(user);
    } catch (err) {
        res.json(err);
    }
};

async function findAllUsers(req, res) {
    const users = await User.find({}).lean().exec();
    users.map(user => user.password = undefined);
    try {
        if (users.length === 0) {
            throw "Nije pronađen nijedan korisnik u bazi.";
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
        const deletedProducts = await Product.deleteMany({ userid: id }).exec();
        console.log(user);

        if (user.n === 0) { throw "Korisnik nije pronađen." } else {
            res.status(201).json({ id: id, deletedProducts: deletedProducts });
        }

    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }

}

async function editUser(req, res) {
    let id = req.body.id;
    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        let filePath = "https://drive.google.com/file/d/1_-9zTrlAg_0CQoVn4tuU3ii9g75LibfG/view?usp=drivesdk";
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
        req.body["password"] = crypto.createHash('sha256').update(req.body["password"]).digest('hex');
        let fileName = Date.now() + req.files.avatar.name;
        file.mv('./uploads/' + fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                async function uploadAvatar() {
                    let filePath = path.join(__dirname, "../", "/uploads/", fileName);
                    req.body.avatar = filePath;
                    var fileMetadata = {
                        'name': fileName,
                        'parents': ['1gHN9y7QD0r7U9wsMu5DsmEl43HCvJm_5']
                    };
                    var media = {
                        mimeType: 'image/jpeg',
                        body: fs.createReadStream(filePath)
                    };
                    drive.files.create({

                        resource: fileMetadata,
                        media: media,
                        fields: '*'
                    }, async function(err, response) {
                        if (err) {
                            // Handle error
                            console.error(err);
                        } else {
                            console.log('File Id: ', response.data.webViewLink);
                            req.body.avatar = response.data.webViewLink;
                            let newUser = req.body;
                            try {
                                const user = await User.findOneAndUpdate({ _id: id }, newUser, { new: true, upsert: true, setDefaultsOnInsert: true });
                                res.status(201).json(user);


                            } catch (error) {
                                console.log(error);
                                res.json({ error: error });

                            }
                        }
                    });

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
            throw "Za ovog korisnika nisu pronađeni proizvodi.";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }

};

module.exports = {
    findUserById,
    findAllUsers,
    deleteUser,
    editUser,
    usersProducts
}