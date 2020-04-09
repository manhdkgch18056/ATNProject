const express = require('express');
const engines = require('consolidate');
const app = express();

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var indexController = require("./index.js");

app.use('/index', indexController);

var server = app.listen(3000, function() {});