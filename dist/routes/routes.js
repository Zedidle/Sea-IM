const check = require('../lib/check');
const start_RL = require('./start_RL');
const people = require('./people');
const team = require('./team');
const search = require('./search');
const message = require('./message');
const back = require('./back');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const urlencodedParser = bodyParser.urlencoded({ extended: false })


module.exports = function(app){
app.use(session({  
        resave: false,  
        saveUninitialized: true,  
        cookie: {maxAge:3600000},  
        secret: 'test',  
})); 

	app.use('/',start_RL);
	app.use('/',people);
	app.use('/',team);
	app.use('/',search);
	app.use('/',message);
	app.use('/',back);
}
