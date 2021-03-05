const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const key = require('../auth.json')
const auth = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES)


const drive = google.drive({ version: "v3", auth });


async function createProduct(req, res) {
    let price = req.body.price;
    let name = req.body.name;
    let image = req.files.image;
    console.log(req.body)
    try {
        if (!price || !name || !image) {
            throw "Morate unijeti ime, cijenu i sliku."
        }
    } catch (error) {
        res.json({ error: error });
    }
    try {
        let productName = req.body.name;
        const productExist = await Product.find({ name: productName }).exec();
        if (productExist.length === 1) {
            throw "Ovaj proizvod već postoji u bazi.";
        }
    } catch (error) {
        res.json({ error: error });
    }

    let fileName = Date.now() + req.files.image.name;

    file.mv('./uploads/' + fileName, (err) => {
        if (err) {
            console.log(err);
        } else {
            async function uploadImage() {
                let filePath = path.join(__dirname, '../', "/uploads/", fileName);
                var fileMetadata = {
                    'name': fileName,
                    'parents': ['1gHN9y7QD0r7U9wsMu5DsmEl43HCvJm_5']
                };
                var media = {
                    mimeType: 'image/jpeg',
                    body: fs.createReadStream(filePath)
                };
                let uploadPath = __dirname + "/uploads/" + fileName;

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
                        req.body.image = response.data.webViewLink;
                        let newProduct = req.body;
                        try {
                            const user = await Product.create(newProduct);
                            res.status(201).json(user);


                        } catch (error) {
                            console.log(error);
                            res.json({ error: error });

                        }
                    }
                });
            }
            uploadImage();
        }
    })


}

async function findAllProducts(req, res) {
    const products = await Product.find({}).lean().exec();
    try {
        if (products.length === 0) {
            throw "Nema proizvoda u bazi.";
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
        if (product.n === 0) { throw "Proizvod ne postoji u bazi." } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }
}

async function editProduct(req, res) {
    let id = req.body.id;
    let file = req.files.image;
    let fileName = Date.now() + req.files.image.name;
    file.mv('./uploads/' + fileName, (err) => {
        if (err) {
            console.log(err);
        } else {
            async function uploadPhoto() {
                let filePath = path.join(__dirname, '../', "/uploads/", fileName);
                req.body.image = filePath;
                let newProduct = req.body;
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
                        req.body.image = response.data.webViewLink;
                        let newProduct = req.body;
                        try {
                            const product = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true, upsert: true, setDefaultsOnInsert: true });
                            res.status(201).json(product);


                        } catch (error) {
                            console.log(error);
                            res.json({ error: error });

                        }
                    }
                });
            }
            uploadPhoto();
        }
    })

}

async function findProductsByCategory(req, res) {
    const products = await Product.find({ category: req.body.category }).lean().exec();
    try {
        if (products.length === 0) {
            throw "Nema proizvoda u bazi. ";
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

};

const findProductById = async function(req, res) {
    try {
        const productId = req.params.id;
        const result = await Product.findById(productId).exec();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ "Greška": "Nema proizvdoa sa tim ID-jem u bazi." });
        }
    } catch (err) {
        res.json({ error: err });
    }

};

async function getRecommendedProducts(req, res) {
    const products = await Product.find({ recommended: req.body.recommended }).lean().exec();
    try {
        if (products.length === 0) {
            throw "Nema proizvoda u bazi. ";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        res.json({ error: error });
    }
}

async function getGiveawayProducts(req, res) {
    const products = await Product.find({ giveaway: req.body.giveaway }).lean().exec();
    try {
        if (products.length === 0) {
            throw "Nema proizvoda u bazi. ";
        } else {
            res.status(201).json(products);
        }
    } catch (error) {
        res.json({ error: error });
    }
}

module.exports = {
    createProduct,
    findAllProducts,
    deleteProduct,
    editProduct,
    findProductsByCategory,
    filter,
    findProductById,
    getRecommendedProducts,
    getGiveawayProducts

}