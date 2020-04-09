const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb+srv://manhdkgch18056:DaoKhacManh00@cluster0-pyltn.mongodb.net/test?retryWrites=true&w=majority';

router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allSanPham', {products: results});
})
router.get('/search', async (req, res) => {
    res.render('searchSanPham');
})
router.post('/search', async (req, res) => {
        let searchProduct = req.body.product_name;
        let client = await MongoClient.connect(url);
        let dbo = client.db("ATNDatabase");
        let results = await dbo.collection("products").find({"product_name": searchProduct}).toArray();
        res.render('allSanPham', {products: results})
    }
)

router.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").deleteOne({"_id": ObjectID(id)});
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allSanPham', {products: results})
})
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    let result = await dbo.collection("products").findOne({"_id": ObjectID(id)});
    res.render('edit', {products: result});
})

router.post('/edit', async (req, res) => {
    let id = req.body.id;
    console.log("ID "+id);
    let product_name = req.body.product_name;
    let price = req.body.price;
    let color = req.body.color;
    let newValues = {$set: {product_name: product_name, color: color, price: price}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id": ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").updateOne(condition, newValues);
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allSanPham', {products: results});
})

router.get('/insert', async (req, res) => {
        res.render('insertSanPham');
    }
)
router.post('/insert', async (req, res) => {

    var insertSP = {
        _id: req.body._id,
        product_name: req.body.product_name,
        color: req.body.color,
        price: req.body.price
    };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNDatabase");
    await dbo.collection("products").insertOne(insertSP);
    let result2 = await dbo.collection("products").find({}).toArray();
    res.render('allSanPham',{products: result2})
    })
router.get('/edit/:id', async (req, res) => {
        res.render('edit');
    }
)


module.exports = router;