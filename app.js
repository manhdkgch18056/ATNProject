var http = require('http')
var port = process.env.PORT || 3000;
const express = require('express');
const favicon = require('express-favicon');
const engines = require('consolidate');
const app = express();
var path = require("path");
var bodyParser = require("body-parser");
var publicDir = require('path').join(__dirname, '/public');
var indexController = require('./index.js');
var productsController = require('./products.js');
var server = http.createServer((function (request, response) {

//npm i handlebars consolidate --save
    app.engine('hbs', engines.handlebars);
    app.set('views', './views');
    app.set('view engine', 'hbs');

    app.use(bodyParser.urlencoded({extended: false}));

    app.use(favicon(__dirname + '/public/images/favicon.ico'));

    app.use('/index', indexController);
    app.use('/products', productsController);

}));

server.listen(port, () => {
    console.log(`Server running at port ` + port);
});