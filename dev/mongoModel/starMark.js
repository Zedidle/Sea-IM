var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var starMarkSchema = new Schema({
	username:String,
	stars: Array,
})

var StarMark = mongoose.model('StarMark', starMarkSchema);
module.exports = StarMark;