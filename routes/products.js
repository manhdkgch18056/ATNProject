const express = require('express');
var router = express.Router();
const multer = require('multer');
fs = require('fs-extra');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://manhdkgch18056:DaoKhacManh00@cluster0-pyltn.mongodb.net/test?retryWrites=true&w=majority';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db('ATNDatabase')
});
router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allProducts', {products: results});
});

router.get('/delete', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").deleteOne({"_id": ObjectID(id)});
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allProducts', {products: results})
});

router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    let result = await dbo.collection("products").findOne({"_id": ObjectID(id)});
    res.render('edit', {products: result});
});

router.post('/edit', upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    let id = req.body.id;
    console.log("ID " + id);
    let product_name = req.body.product_name;
    let price = req.body.price;
    let color = req.body.color;
    let contentType = req.file.mimetype;
    image = new Buffer(encode_image, 'base64');
    let newValues = {
        $set: {
            product_name: product_name,
            color: color,
            price: price,
            contentType: contentType,
            image: image
        }
    };
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id": ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").updateOne(condition, newValues);
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allProducts', {products: results});
});

router.get('/insert', async (req, res) => {
    res.render('insert');
});

router.post('/insert', upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    console.log("img: "+img);
    var encode_image = img.toString('base64');

    var insertProducts = {
        _id: req.body._id,
        product_name: req.body.product_name,
        color: req.body.color,
        price: req.body.price,
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").insertOne(insertProducts, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
    });
    let result2 = await dbo.collection("products").find({}).toArray();
    res.render('allProducts', {products: result2});
});

router.get('/photos', (req, res) => {
    db.collection('products').find().toArray((err, result) => {
        const imgArray = result.map(element => element._id);
        console.log(imgArray);
        if (err) return console.log(err)
        res.send(imgArray)
    })
});

router.get('/photos/:id', (req, res) => {
    var filename = req.params.id;
    db.collection('products').findOne({'_id': ObjectId(filename)}, (err, result) => {
        if (err) return console.log(err);
        res.contentType('image/jpeg');
        res.send(result.image.buffer);
    })
});

module.exports = router;