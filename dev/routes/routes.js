const start = require('./start');
const people = require('./people');
const back = require('./back');
const unreadnumber = require('./unreadnumber');
const team = require('./team');
const search = require('./search');
const message = require('./message');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const urlencodedParser = bodyParser.urlencoded({ extended: false })


module.exports = function(app){
	app.use(session({
        resave: false,  
        saveUninitialized: true,  
        cookie: {maxAge:36000000},  
        secret: 'test',  
	})); 

// console.log('Session in router:' +session);

	app.use('/',start);
	app.use('/',people);
	app.use('/',team);
	app.use('/',search);
	app.use('/',message);
	app.use('/',back);
	app.use('/',unreadnumber);
}
