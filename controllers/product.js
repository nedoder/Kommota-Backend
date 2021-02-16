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

        let fileName = Date.now() + req.files.image.name;

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

async function findProductsByCategory(req, res) {
    const products = await Product.find({ category: req.body.category }).lean().exec();
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

async function filter(req, res) {
    //req.body je objekat koji dobijamo od frontenda
    //svaki property objekta je niz sa odredjenim vrijednostima (kategorija, prodavac, kolicina, cijena)
    //property  su setovane po defaultu na prazan niz, i ukoliko ih user ne podesi front ih brise iz objekta prije nego sto posalje backu
    //kad back primi objekat for in petljom prodje kroz njega kako bi znao koliko ima propertyja
    //ako ima jedan property radi jedan upit, ako ima vise onda radi drugi upit (and upit)
    //na backu se kreira JSON objekat koji se prije slanja bazi parsira i salje kao klasicni JS objekat
    console.log(req.body);
    var filter = req.body;
    var num = 0;
    var num1 = 0;
    var query = "";
    var query1 = "{ " + "\"" + "$and" + "\"" + ": [";
    for (x in filter) {
        num++;
    }
    for (x in filter) {
        if (num === 1) {
            console.log("jedan");
            var stringarr = [];
            if (x === "category" || x === "userid") {
                //prodjemo kroz svaki element niza i pushujemo ga pod "" zbog pravila JSON objekta
                for (var i = 0; i < filter[x].length; i++) {
                    stringarr.push(("\"" + filter[x][i] + "\""));
                }
                query += "{ " + "\"" + x + "\"" + ": { " + "\"" + "$in" + "\"" + ":[" + stringarr + "] } }";
            } else {
                query += "{" + "\"" + x + "\"" + ":{" + "\"" + "$gt" + "\"" + ":" + filter[x][0] + "," + "\"" + "$lt" + "\"" + ":" + filter[x][1] + "}}"
            }
            console.log(query);
            console.log(JSON.parse(query));

            try {
                const filteredProducts = await Product.find(JSON.parse(query));
                res.status(201).send(filteredProducts);
                console.log(filteredProducts);
            } catch (err) {
                console.log(err);
                res.json({ error: err });
            }


        }
        //ako postoji vise od jednog propertyja radi se and upit
        //ukoliko je num1 === num znaci da vrsimo iteraciju kroz poslednji property objekta i da moramo zatvoriti upit odgovarajucim zagradama
        else {
            num1++;
            var stringarr = [];
            if (num1 === num) {
                if (x === "category" || x === "userid") {
                    for (var i = 0; i < filter[x].length; i++) {
                        stringarr.push(("\"" + filter[x][i] + "\""));
                    }
                    query1 += "{ " + "\"" + x + "\"" + ": { " + "\"" + "$in" + "\"" + ":[" + stringarr + "] } }]}";
                } else {
                    query1 += "{" + "\"" + x + "\"" + ":{" + "\"" + "$gt" + "\"" + ":" + filter[x][0] + "," + "\"" + "$lt" + "\"" + ":" + filter[x][1] + "}}]}"

                }
            } else {
                if (x === "category" || x === "userid") {
                    for (var i = 0; i < filter[x].length; i++) {
                        stringarr.push(("\"" + filter[x][i] + "\""));
                    }
                    query1 += "{ " + "\"" + x + "\"" + ": { " + "\"" + "$in" + "\"" + ":[" + stringarr + "] } },";
                } else {
                    query1 += "{" + "\"" + x + "\"" + ":{" + "\"" + "$gt" + "\"" + ":" + filter[x][0] + "," + "\"" + "$lt" + "\"" + ":" + filter[x][1] + "}},"
                }
            }
        }

    }
    console.log(query1);
    console.log(JSON.parse(query1))

    try {
        const formattedQuery = JSON.parse(query1);
        const filteredProducts = await Product.find(formattedQuery);
        console.log(filteredProducts)
        res.status(200).send(filteredProducts);
    } catch (err) {
        res.json({ error: err });
    }

}
module.exports = {
    createProduct,
    findAllProducts,
    deleteProduct,
    editProduct,
    findProductsByCategory,
    filter
}