var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;
var peopleteamSchema = new Schema({
	username:String,
	build:String,
	join:Array,
})

var Peopleteam = mongoose.model('Peopleteam', peopleteamSchema);
module.exports = Peopleteam;
