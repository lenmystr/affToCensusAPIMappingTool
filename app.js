require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

var logger = require('morgan');

var mappingRoute = require('./routes/mappingRoute');
var censusRoute = require('./routes/censusRoute');
var affRoute = require('./routes/affRoute');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use('/mapping', mappingRoute);
app.use('/census', censusRoute);
app.use('/aff', affRoute);

module.exports = app;
