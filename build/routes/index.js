const start = require('./start');
const people = require('./people');
const unread = require('./unread');
const team = require('./team');
const search = require('./search');
const message = require('./message');


module.exports = function(app){

	app.use('/',start);
	app.use('/',people);
	app.use('/',team);
	app.use('/',search);
	app.use('/',message);
	app.use('/',unread);
}
