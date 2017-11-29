const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const test = require('./test');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


module.exports = function(app){
	app.use(session({
        resave: false,  
        saveUninitialized: true,  
        cookie: {maxAge:36000000},  
        secret: 'test',  
	})); 
	app.use('/',test);
}
