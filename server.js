const express = require('express');
const favicon = require('express-favicon');
const engines = require('consolidate');
const server = express();
var path = require("path");
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: false}));
var publicDir = require('path').join(__dirname, '/public');




//npm i handlebars consolidate --save
server.engine('hbs', engines.handlebars);
server.set('views', './views');
server.set('view engine', 'hbs');


var indexController = require('./index.js');
var SanPhamController = require('./SanPham.js');

server.use(favicon(__dirname + '/public/images/logo.png'));

server.use('/index', indexController);
server.use('/sanpham', SanPhamController);

var server = server.listen(8000, function () {
    console.log("Running at port 8000 ")
});
