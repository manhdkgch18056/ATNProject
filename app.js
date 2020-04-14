const express = require('express');
const favicon = require('express-favicon');
const engines = require('consolidate');
const app = express();
var path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
var publicDir = require('path').join(__dirname, '/public');

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var indexController = require('./index.js');
var productsController = require('./products.js');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/index', indexController);
app.use('/products', productsController);
var server = app.listen(8000, function () {
    console.log("Running at port 8000 ")
});
