const Product = require("../models/product");

async function createProduct(req, res) {
    let price = req.body.price;
    let name = req.body.name;
    console.log(req.body)
    try {
        if (!price || !name) {
            throw "You must enter name and price"
        }
    } catch (error) {
        res.json({ error: error });
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
        let filePath = __dirname + "/uploads/" + "noimage.png";
        console.log(filePath)
        req.body.image = filePath;
        let newProduct = req.body;
        console.log(newProduct)
        try {
            const product = await Product.create(newProduct);
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
                        const product = await Product.create(newProduct);
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

}

async function findAllProducts(req, res) {
    const products = await Product.find({}).lean().exec();
    try {
        if (products.length === 0) {
            throw "There are no products in database. ";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        res.json({ error: error });
    }
}
async function deleteProduct(req, res) {
    let id = req.body.id;
    try {
        const product = await Product.deleteOne({ _id: id }).exec();
        if (product.n === 0) { throw "Product does not exist in db" } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }
}

async function editProduct(req, res) {
    let id = req.body.id;
    console.log(id);
    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        let filePath = __dirname + "/uploads/" + "noimage.png";
        req.body.image = filePath;
        let newProduct = req.body;
        try {
            const product = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true, upsert: true, setDefaultsOnInsert: true });
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
}

module.exports = {
    createProduct,
    findAllProducts,
    deleteProduct,
    editProduct
}